package com.intuitive.app.business.RelatoriosService;

import com.intuitive.app.infrastructure.repository.RelatoriosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class MediaFomeService {

    @Autowired
    private RelatoriosRepository relatoriosRepository;

    // Média da fome dos últimos 7 dias
    public Double mediaFomeUltimos7Dias(Integer idUsuario) {
        LocalDate hoje = LocalDate.now();
        LocalDate seteDiasAtras = hoje.minusDays(6);

        Double media = relatoriosRepository.calcularMediaFome(idUsuario, seteDiasAtras, hoje);

        return media != null ? media : 0.0;
    }

    // Média da fome dos últimos 30 dias
    public Double mediaFomeUltimos30Dias(Integer idUsuario) {

        LocalDate hoje = LocalDate.now();
        LocalDate trintaDiasAtras = hoje.minusDays(30);

        Double media = relatoriosRepository.calcularMediaFome(idUsuario, trintaDiasAtras, hoje);
        return media != null ? media : 0.0;
    }
}

