#include <iostream>
#include <string>

#include "Hospital.h"
#include "Paciente.h"
#include "Medico.h"

using namespace std;

// Main.cpp


int main() {
    Hospital h1;
    bool sair = false;

    while (!sair) {
        cout << "\n=== Sistema de Monitoramento de Leitos ===\n";
        cout << "1 - Criar hospital\n";
        cout << "2 - Cadastrar paciente\n";
        cout << "3 - Internar paciente\n";
        cout << "4 - Liberar leito\n";
        cout << "5 - Listar leitos\n";
        cout << "6 - Listar pacientes\n";
        cout << "7 - Relatório\n";
        cout << "8 - Exportar JSON\n";
        cout << "9 - Resetar hospital\n";
        cout << "10 - Avaliar paciente (médico)\n";
        cout << "0 - Sair\n> ";
        int op;
        cin >> op;

        switch (op) {
            case 1: {
                // Criar hospital com nome e quantidade inicial de leitos
                string nome;
                int qtd;
                cout << "Nome do hospital: ";
                cin >> nome;
                cout << "Qtd. de leitos: ";
                cin >> qtd;
                h1 = Hospital(nome, qtd);
                break;
            }
            case 2: {
                // Cadastrar paciente
                long int id;
                string nome, diag;
                short int idade;
                cout << "ID: "; cin >> id;
                cout << "Nome: "; cin >> nome;
                cout << "Idade: "; cin >> idade;
                cout << "Diagnóstico: "; cin >> diag;
                h1.cadastrarPaciente(Paciente(id, nome, idade, diag));
                break;
            }
            case 3: {
                // Internar paciente em leito escolhido
                long int id;
                int leito;
                cout << "ID do paciente: "; cin >> id;
                cout << "Número do leito: "; cin >> leito;
                h1.internarPaciente(id, leito);
                break;
            }
            case 4: {
                // Liberar leito por número
                int leito;
                cout << "Número do leito: "; cin >> leito;
                h1.liberarLeito(leito);
                break;
            }
            case 5:
                h1.listarLeitos();
                break;
            case 6:
                h1.listarPacientes();
                break;
            case 7:
                h1.relatorio();
                break;
            case 8:
                h1.exportarJSON("hospital.json");
                break;
            case 9:
                h1.resetar();
                break;

            case 10: {
                // médico avalia paciente por ID.
                long int id;
                cout << "ID do paciente para avaliação: ";
                cin >> id;

                bool encontrado = false;

                // Itera sobre os pacientes cadastrados
                for (auto& pac : h1.getPacientes()) {
                    if (pac.getid() == id) {
                        encontrado = true;

                        // Instãncia um médico
                        Medico m(1,"Carlos", 45, "Clínico Geral", "CRM-1234");
                        m.avaliarPaciente(h1, pac);
                        break;
                    }
                }

                if (!encontrado) {
                    cout << "Paciente não encontrado.\n";
                }
                break;
            }

            case 0:
                sair = true;
                break;

            default:
                cout << "Opção inválida.\n";
        }
    }

    cout << "Encerrando sistema..." << endl;
    return 0;
}