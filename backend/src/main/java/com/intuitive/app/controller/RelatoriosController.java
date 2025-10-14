package com.intuitive.app.controller;

import com.intuitive.app.business.RelatoriosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/relatorios")
public class RelatoriosController {

    @Autowired
    private RelatoriosService relatoriosService;

    // Média diária de refeições por semana
    @GetMapping("/media/semana")
    public Double mediaDiariaSemana(
            @RequestParam Integer idUsuario,
            @RequestParam int ano,
            @RequestParam int semana) {
        return relatoriosService.mediaDiariaSemana(idUsuario, ano, semana);
    }

    // Média diária de refeições por mês
    @GetMapping("/media/mes")
    public Double mediaDiariaMes(
            @RequestParam Integer idUsuario,
            @RequestParam int ano,
            @RequestParam int mes) {
        return relatoriosService.mediaDiariaMes(idUsuario, ano, mes);
    }
}
