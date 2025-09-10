package com.intuitive.app.infrastructure.entitys;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "usuario")
@Entity

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name ="email", unique = true)

    private String email;

    @Column(name = "nome")
    private String  nome;

    @Column(name = "senha")
    private String senha;

    @Column(name = "sexo")
    private String sexo;

    @Column(name = "dt_nascimento")
    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dtNascimento;


}
