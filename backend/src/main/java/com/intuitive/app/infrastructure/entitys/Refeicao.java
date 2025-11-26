package com.intuitive.app.infrastructure.entitys;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import java.sql.Time;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "refeicao")
@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "idRefeicao"
)

public class Refeicao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer idRefeicao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "data")
    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "America/Sao_Paulo")
    private LocalDate data;

    @Column(name = "horario")
    private Time horario;

    @Column(name = "tipo", length = 20)
    private String tipo;

    @Column(name = "descricao", length = 500)
    private String descricao;

    @Column(name = "nivel_fome")
    private Integer nivelFome;

    @Column(name = "companhia")
    private String companhia;

    @Column(name = "distracoes")
    private String distracoes;

    @Column(name = "emocoes_antes")
    private String emocoesAntes;

    @Column(name = "emocoes_depois")
    private String emocoesDepois;

    @Column(name = "nivel_saciedade")
    private Integer nivelSaciedade;
}
