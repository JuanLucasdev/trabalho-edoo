// backend.cpp
#include <winsock2.h>
#include <iostream>
#include <sstream>
#include <string>
#include <thread>
#include <vector>
#include <algorithm>
#include <cctype>
#include <fstream>

#pragma comment(lib, "ws2_32.lib")

#include "Hospital.h"
#include "Paciente.h"
#include "Medico.h"

Hospital hospital;
int totalLeitos = 0;

// ------------------------ UTILITÁRIOS ------------------------
static std::string get_request_body(const std::string& req) {
    size_t pos = req.find("\r\n\r\n");
    if (pos == std::string::npos) return "";
    return req.substr(pos + 4);
}

static bool extract_number(const std::string& json, const std::string& key, long long &out) {
    std::string needle = "\"" + key + "\"";
    size_t p = json.find(needle);
    if (p == std::string::npos) return false;
    size_t colon = json.find(':', p);
    if (colon == std::string::npos) return false;
    size_t start = colon + 1;
    while (start < json.size() && isspace((unsigned char)json[start])) ++start;
    size_t end = start;
    if (end < json.size() && (json[end] == '-' || json[end] == '+')) ++end;
    while (end < json.size() && isdigit((unsigned char)json[end])) ++end;
    if (end == start) return false;
    try { out = std::stoll(json.substr(start, end - start)); } catch (...) { return false; }
    return true;
}

static bool extract_string(const std::string& json, const std::string& key, std::string &out) {
    std::string needle = "\"" + key + "\"";
    size_t p = json.find(needle);
    if (p == std::string::npos) return false;
    size_t colon = json.find(':', p);
    if (colon == std::string::npos) return false;
    size_t first_quote = json.find('"', colon + 1);
    if (first_quote == std::string::npos) return false;
    size_t second_quote = json.find('"', first_quote + 1);
    if (second_quote == std::string::npos) return false;
    out = json.substr(first_quote + 1, second_quote - first_quote - 1);
    return true;
}

static std::string make_http_response(const std::string &body, const std::string &content_type = "application/json") {
    std::ostringstream oss;
    oss << "HTTP/1.1 200 OK\r\n"
        << "Content-Type: " << content_type << "\r\n"
        << "Access-Control-Allow-Origin: *\r\n"
        << "Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS\r\n"
        << "Access-Control-Allow-Headers: Content-Type\r\n"
        << "Content-Length: " << body.size() << "\r\n"
        << "Connection: close\r\n\r\n"
        << body;
    return oss.str();
}

// ------------------------ JSON PACIENTES ------------------------
static std::string pacientes_to_json() {
    std::ostringstream oss;
    auto &vec = hospital.getPacientes();
    oss << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        const Paciente &p = vec[i];
        std::string nome = p.getnome();
        std::string diag = p.getdiagnostico();
        std::replace(nome.begin(), nome.end(), '"', '\'');
        std::replace(diag.begin(), diag.end(), '"', '\'');
        oss << "{"
            << "\"id\":" << p.getid() << ","
            << "\"nome\":\"" << nome << "\","
            << "\"idade\":" << p.getidade() << ","
            << "\"diagnostico\":\"" << diag << "\""
            << "}";
        if (i + 1 < vec.size()) oss << ",";
    }
    oss << "]";
    return oss.str();
}

// ------------------------ JSON LEITOS ------------------------
static std::string leitos_to_json() {
    std::ostringstream oss;
    auto &leitos = hospital.getLeitos();
    oss << "[";
    for (size_t i = 0; i < leitos.size(); ++i) {
        const Leito &l = leitos[i];
        oss << "{"
            << "\"numero\":" << l.numero << ","
            << "\"ocupado\":" << (l.ocupado ? "true" : "false") << ","
            << "\"id_paciente\":" << l.id_paciente
            << "}";
        if (i + 1 < leitos.size()) oss << ",";
    }
    oss << "]";
    return oss.str();
}

// ------------------------ JSON MÉDICOS ------------------------
static std::string medicos_to_json() {
    std::ostringstream oss;
    auto &vec = hospital.getMedicos();
    oss << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        const Medico &m = vec[i];
        oss << "{"
            << "\"id\":" << m.getid() << ","
            << "\"nome\":\"" << m.getnome() << "\","
            << "\"idade\":" << m.getidade() << ","
            << "\"especialidade\":\"" << m.getespecialidade() << "\","
            << "\"crm\":\"" << m.getcrm() << "\""
            << "}";
        if (i + 1 < vec.size()) oss << ",";
    }
    oss << "]";
    return oss.str();
}

// ------------------------ THREAD CLIENTE ------------------------
static void client_thread(SOCKET client) {
    const int BUF_SIZE = 8192;
    char buffer[BUF_SIZE];
    int received = recv(client, buffer, BUF_SIZE - 1, 0);
    if (received <= 0) { closesocket(client); return; }
    buffer[received] = '\0';
    std::string request(buffer);

    std::string response;
    std::string body = get_request_body(request);
    std::istringstream iss(request);
    std::string method, path;
    iss >> method >> path;

    if (method == "OPTIONS") response = make_http_response("{}");

    // PACIENTES
    else if (method == "GET" && (path == "/pacientes" || path == "/pacientes/"))
        response = make_http_response(pacientes_to_json());
    else if (method == "POST" && (path == "/pacientes" || path == "/pacientes/")) {
        long long id = 0;
        std::string nome, diagnostico;
        if (!extract_number(body, "id", id) ||
            !extract_string(body, "nome", nome) ||
            !extract_string(body, "diagnostico", diagnostico)) {
            response = make_http_response(R"({"status":"erro","msg":"JSON inválido"})");
        } else {
            Paciente p((long int)id, nome, 30, diagnostico);
            hospital.cadastrarPaciente(p);
            response = make_http_response(R"({"status":"ok","msg":"Paciente cadastrado"})");
        }
    }

    // MÉDICOS (temporários como pacientes)
    else if (method == "GET" && (path == "/medicos" || path == "/medicos/"))
        response = make_http_response(medicos_to_json());
    else if (method == "POST" && (path == "/medicos" || path == "/medicos/")) {
        long long id = 0;
        std::string nome, esp, crm;
        long int idade = 30;
        if (!extract_number(body, "id", id) ||
            !extract_string(body, "nome", nome) ||
            !extract_string(body, "especialidade", esp) ||
            !extract_string(body, "crm", crm)) {
            response = make_http_response(R"({"status":"erro","msg":"JSON inválido"})");
        } else {
            Medico m((long int)id, nome, idade, esp, crm);
            hospital.cadastrarMedico(m);
            response = make_http_response(R"({"status":"ok","msg":"Médico cadastrado"})");
        }
    }

    // LEITOS
    else if (method == "GET" && (path == "/leitos" || path == "/leitos/"))
        response = make_http_response(leitos_to_json());
    else if (method == "POST" && (path == "/internar" || path == "/internar/")) {
        long long id = 0, leito = 0;
        if (!extract_number(body, "id", id) || !extract_number(body, "leito", leito)) {
            response = make_http_response(R"({"status":"erro","msg":"JSON inválido"})");
        } else {
            hospital.internarPaciente((long int)id, (int)leito);
            response = make_http_response(R"({"status":"ok","msg":"Internação registrada"})");
        }
    }
    else if (method == "POST" && (path == "/avaliar" || path == "/avaliar/")) {
        long long id = 0;
        if (!extract_number(body, "id", id)) response = make_http_response(R"({"status":"erro","msg":"JSON inválido"})");
        else {
            bool found = false;
            for (auto &p : hospital.getPacientes()) {
                if (p.getid() == (long int)id) {
                    found = true;
                    p.setdiagnostico("saudável");
                    hospital.removerPacienteDoLeito(p.getid());
                    response = make_http_response(R"({"status":"ok","msg":"Paciente avaliado e alta concedida."})");
                    break;
                }
            }
            if (!found) response = make_http_response(R"({"status":"erro","msg":"Paciente não encontrado"})");
        }
    }

    // EXPORTAR JSON
    else if (method == "GET" && (path == "/exportar" || path == "/exportar/")) {
        hospital.exportarJSON("relatorio.json");
        response = make_http_response(R"({"status":"ok","msg":"Arquivo JSON exportado com sucesso!"})");
    }

    // RESET
    else if (method == "DELETE" && (path == "/resetar" || path == "/resetar/")) {
        hospital.resetar();
        totalLeitos = 10;
        hospital.criarLeitos(totalLeitos);
        response = make_http_response(R"({"status":"ok","msg":"Hospital resetado"})");
    }

    else response = make_http_response(R"({"status":"erro","msg":"Rota não encontrada"})");

    send(client, response.c_str(), (int)response.size(), 0);
    closesocket(client);
}

// ------------------------ MAIN ------------------------
int main() {
    totalLeitos = 10;
    hospital.criarLeitos(totalLeitos);

    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) { std::cerr << "Erro WSAStartup\n"; return 1; }

    SOCKET server = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (server == INVALID_SOCKET) { std::cerr << "Erro socket\n"; WSACleanup(); return 1; }

    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(8080);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    if (bind(server, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "Erro bind\n"; closesocket(server); WSACleanup(); return 1;
    }
    if (listen(server, SOMAXCONN) == SOCKET_ERROR) {
        std::cerr << "Erro listen\n"; closesocket(server); WSACleanup(); return 1;
    }

    std::cout << "Servidor HTTP rodando em http://localhost:8080\n";

    while (true) {
        sockaddr_in clientAddr;
        int clientSize = sizeof(clientAddr);
        SOCKET client = accept(server, (sockaddr*)&clientAddr, &clientSize);
        if (client == INVALID_SOCKET) continue;
        std::thread(client_thread, client).detach();
    }

    closesocket(server);
    WSACleanup();
    return 0;
}
