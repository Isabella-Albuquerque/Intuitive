package com.intuitive.app.controller;

import com.intuitive.app.DTO.RelatorioDistracoesDto;
import com.intuitive.app.business.RelatoriosService.DistracaoService;
import com.intuitive.app.business.RelatoriosService.MediaRefeicoesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/relatorios")
public class RelatoriosController {

    @Autowired
    private MediaRefeicoesService mediaRefeicoesService;

    // 🔹 Média diária dos últimos 7 dias
    @GetMapping("/mediarefeicoes/ultimos7dias")
    public Double mediaDiariaUltimos7Dias(@RequestParam Integer idUsuario) {
        return mediaRefeicoesService.mediaDiariaUltimos7Dias(idUsuario);
    }

    // Endpoint para média diária dos últimos 30 dias
    @GetMapping("mediarefeicoes/ultimos30dias")
    public Double mediaUltimos30Dias(@RequestParam Integer idUsuario) {
        return mediaRefeicoesService.mediaDiariaUltimos30Dias(idUsuario);
    }

//========================RELATORIO DISTRACAO===================================
    private final DistracaoService distracaoService;

    public RelatoriosController(DistracaoService distracaoService) {
        this.distracaoService = distracaoService;
    }

    @GetMapping("distracoes/ultimos7dias/{idUsuario}")
    public List<RelatorioDistracoesDto> distracoesSemana(@PathVariable Long idUsuario) {
        RelatorioDistracoesDto ultimos7Dias = distracaoService.contarUltimos7Dias(idUsuario);
        return Arrays.asList(ultimos7Dias);
    }

    @GetMapping("/distracoes/ultimos30dias/{idUsuario}")
    public List<RelatorioDistracoesDto> distacoesMes(@PathVariable Long idUsuario) {
        RelatorioDistracoesDto ultimos30Dias = distracaoService.contarUltimos30Dias(idUsuario);
        return Arrays.asList(ultimos30Dias);
    }
}