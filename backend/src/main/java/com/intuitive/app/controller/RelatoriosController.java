package com.intuitive.app.controller;

import com.intuitive.app.DTO.RelatorioDistracoesDto;
import com.intuitive.app.DTO.RelatorioEmocoesDto;
import com.intuitive.app.business.RelatoriosService.DistracaoService;
import com.intuitive.app.business.RelatoriosService.EmocoesService;
import com.intuitive.app.business.RelatoriosService.MediaRefeicoesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@CrossOrigin(origins = "*") 
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

    public RelatoriosController(DistracaoService distracaoService, EmocoesService emocoesService) {
        this.distracaoService = distracaoService;
        this.emocoesService = emocoesService;
    }

    @GetMapping("distracoes/ultimos7dias/{idUsuario}")
    public List<RelatorioDistracoesDto> distracoesSemana(@PathVariable Long idUsuario) {
        RelatorioDistracoesDto ultimos7Dias = distracaoService.contarUltimos7Dias(idUsuario);
        return Arrays.asList(ultimos7Dias);
    }

    @GetMapping("/distracoes/ultimos30dias/{idUsuario}")
    public List<RelatorioDistracoesDto> distracoesMes(@PathVariable Long idUsuario) {
        RelatorioDistracoesDto ultimos30Dias = distracaoService.contarUltimos30Dias(idUsuario);
        return Arrays.asList(ultimos30Dias);
    }

    //========================RELATORIO EMOCOES===================================

    private final EmocoesService emocoesService;

    @GetMapping("emocoes-antes/ultimos7dias/{idUsuario}")
    public List<RelatorioEmocoesDto> emocoesSemana(@PathVariable Long idUsuario){
        RelatorioEmocoesDto ultimos7dias = emocoesService.contarUltimos7dias(idUsuario);
        return Arrays.asList(ultimos7dias);
    }

    @GetMapping("emocoes-antes/ultimos30dias/{idUsuario}")
    public List<RelatorioEmocoesDto> emocoesMes(@PathVariable Long idUsuario){
        RelatorioEmocoesDto ultimos30dias = emocoesService.contarUltimos30dias(idUsuario);
        return Arrays.asList(ultimos30dias);
    }

    @GetMapping("emocoes-depois/ultimos7dias/{idUsuario}")
    public List<RelatorioEmocoesDto> emocoesDepoisSemana(@PathVariable Long idUsuario){
        RelatorioEmocoesDto ultimos7dias = emocoesService.contarEmocoesDepoisUltimos7dias(idUsuario);
        return Arrays.asList(ultimos7dias);
    }

    @GetMapping("emocoes-depois/ultimos30dias/{idUsuario}")
    public List<RelatorioEmocoesDto> emocoesDepoisMes(@PathVariable Long idUsuario){
        RelatorioEmocoesDto ultimos30dias = emocoesService.contarEmocoesDepoisUltimos30dias(idUsuario);
        return Arrays.asList(ultimos30dias);
    }

}