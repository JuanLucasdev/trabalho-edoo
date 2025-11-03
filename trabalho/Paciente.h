#ifndef PACIENTE_H
#define PACIENTE_H

// Paciente.h
// Classe concreta: Paciente
// Atributos: id, diagnostico.

#include "Pessoa.h"
#include <string>
#include <iostream>

class Paciente : public Pessoa {
private:
    long int id;
    std::string diagnostico;

public:
    // Construtor
    Paciente() : id(0), diagnostico("não identificado") {
        setnome("no-name");
        setidade(0);
    }

    // Construtor com parâmetros
    Paciente(long int id, const std::string& nome, short int idade, const std::string& diag) {
        setid(id);
        setnome(nome);
        setidade(idade);
        setdiagnostico(diag);
        std::cout << "Paciente: " << getnome() << " registrado..." << std::endl;
    }

    // Get/Set do id
    void setid(long int id) { this->id = id; }
    long int getid() const { return id; }

    // Get/Set do diagnóstico
    void setdiagnostico(const std::string& diag) { diagnostico = diag; }
    std::string getdiagnostico() const { return diagnostico; }

    // Implementando o método polimórfico
    void display() const override {
        std::cout << "Paciente [" << getid() << "]: " << getnome()
                  << ", Idade: " << getidade()
                  << ", Diagnóstico: " << getdiagnostico() << std::endl;
    }
};

#endif