package com.intuitive.app.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Time;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RefeicaoDto {
    private Integer idRefeicao;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date data;
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

