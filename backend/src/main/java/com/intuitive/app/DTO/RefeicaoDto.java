package com.intuitive.app.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Time;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RefeicaoDto {
    private Integer idRefeicao;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "America/Sao_Paulo")
    private LocalDate data;
    private Time horario;
    private String tipo;
    private String descricao;
    private Integer nivelFome;
    private String companhia;
    private String distracoes;
    private String emocoesAntes;
    private String emocoesDepois;
    private Integer nivelSaciedade;
    private UsuarioDto usuario;
}

