#ifndef PESSOA_H
#define PESSOA_H

// Pessoa.h
// Define a classe abstrata Pessoa.
// Serve de base para Paciente e Medico.

#include <string>
#include <iostream>

class Pessoa {
private:
    std::string nome;
    short int idade;

public:
    // Construtor
    Pessoa() : nome("no-name"), idade(0) {}

    // Construtor com parâmetros
    Pessoa(const std::string& nome, short int idade) {
        setnome(nome);
        setidade(idade);
    }

    // Destrutor virtual
    virtual ~Pessoa() {}

    // Encapsulamento get/set
    void setnome(const std::string& nome) { this->nome = nome; }
    std::string getnome() const { return nome; }

    void setidade(short int idade) { this->idade = idade; }
    short int getidade() const { return idade; }

    // Método polimórfico
    virtual void display() const = 0;
};

#endif