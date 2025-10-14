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

    // 🔹 Média diária dos últimos 7 dias
    @GetMapping("/ultimos7dias")
    public Double mediaDiariaUltimos7Dias(@RequestParam Integer idUsuario) {
        return relatoriosService.mediaDiariaUltimos7Dias(idUsuario);
    }

    // Endpoint para média diária dos últimos 30 dias
    @GetMapping("/ultimos30dias")
    public Double mediaUltimos30Dias(@RequestParam Integer idUsuario) {
        return relatoriosService.mediaDiariaUltimos30Dias(idUsuario);
    }
}
