package com.intuitive.app.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RelatorioDistracoesDto {
    private Long countSim;
    private Long countNao;
    private String mensagem;
}
