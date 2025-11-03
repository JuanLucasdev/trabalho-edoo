#ifndef MEDICO_H
#define MEDICO_H

// Medico.h
// Classe concreta: Medico.
// Define o método avaliarPaciente(Hospital&, Paciente&).
// O método consulta o diagnóstico do paciente; se for "saudável",
// chama Hospital::removerPacienteDoLeito(id).

#include "Pessoa.h"
#include "Paciente.h"
#include <string>
#include <iostream>

class Hospital; // declaração adiantada

class Medico : public Pessoa {
private:
    std::string especialidade;
    std::string crm;
    long int id;

public:
    // Construtor padrão
    Medico() : especialidade("não definida"), crm("não informado") {
        setnome("no-name");
        setidade(0);
        setid(0);
    }

    // Construtor com parâmetros
    Medico(long int _id, const std::string& nome, short int idade,
           const std::string& especialidade, const std::string& crm) {
        setid(_id);
        setnome(nome);
        setidade(idade);
        setespecialidade(especialidade);
        setcrm(crm);
    }

    // Get/Set
    void setespecialidade(const std::string& esp) { especialidade = esp; }
    std::string getespecialidade() const { return especialidade; }

    void setcrm(const std::string& c) { crm = c; }
    std::string getcrm() const { return crm; }

    void setid(long int i) { id = i; }
    long int getid() const { return id; }

    // Declaração do método (implementado no final de Hospital.h)
    void avaliarPaciente(Hospital& h, Paciente& p);

    // Implementa display
    void display() const override {
        std::cout << "Médico: " << getnome()
                  << ", Idade: " << getidade()
                  << ", Especialidade: " << getespecialidade()
                  << ", CRM: " << getcrm() << std::endl;
    }
};

#endif
