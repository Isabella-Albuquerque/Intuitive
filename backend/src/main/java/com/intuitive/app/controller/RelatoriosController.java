package com.intuitive.app.controller;

import com.intuitive.app.DTO.RelatorioDistracoesDto;
import com.intuitive.app.DTO.RelatorioEmocoesDto;
import com.intuitive.app.business.RelatoriosService.*;
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

    public RelatoriosController(DistracaoService distracaoService, EmocoesService emocoesService, MediaFomeService mediaFomeService, MediaSaciedadeService mediaSaciedadeService) {
        this.distracaoService = distracaoService;
        this.emocoesService = emocoesService;
        this.mediaFomeService = mediaFomeService;
        this.mediaSaciedadeService = mediaSaciedadeService;
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

    //======================== RELATORIO FOME ===================================

    private final MediaFomeService mediaFomeService;

    // 🔹 Média fome dos últimos 7 dias
    @GetMapping("/media-fome/ultimos7dias")
    public Double mediaFome7dias(@RequestParam Integer idUsuario) {
        return mediaFomeService.mediaFomeUltimos7Dias(idUsuario);
    }

    @GetMapping("/media-fome/ultimos30dias")
    public Double mediaFome30dias(@RequestParam Integer idUsuario) {
        return mediaFomeService.mediaFomeUltimos30Dias(idUsuario);
    }

    //======================== RELATORIO SACIEDADE ===================================
    private final MediaSaciedadeService mediaSaciedadeService;

    @GetMapping("/media-saciedade/ultimos7dias")
    public Double mediaSaciedade7dias(@RequestParam Integer idUsuario) {
        return mediaSaciedadeService.mediaSaciedadeUltimos7Dias(idUsuario);
    }

    @GetMapping("/media-saciedade/ultimos30dias")
    public Double mediaSaciedade30dias(@RequestParam Integer idUsuario) {
        return mediaSaciedadeService.mediaSaciedadeUltimos30Dias(idUsuario);
    }

}