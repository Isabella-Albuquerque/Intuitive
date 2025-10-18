package com.intuitive.app.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RelatorioEmocoesDto {

    private Long countFeliz;
    private Long countTriste;
    private Long countCalmo;
    private Long countAnsioso;
    private Long countEstressado;
    private Long countNeutro;
    private Long countCulpado;
    private Long countFrustrado;
    private Long countCansado;
    private Long countRelaxado;
    private Long countEntediado;

}
