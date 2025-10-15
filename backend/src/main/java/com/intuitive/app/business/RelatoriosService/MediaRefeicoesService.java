package com.intuitive.app.business.RelatoriosService;

import com.intuitive.app.infrastructure.repository.RelatoriosRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;


@Service
public class MediaRefeicoesService {

    @Autowired
    private RelatoriosRepository relatoriosRepository;

    // Média diária dos últimos 7 dias
    public Double mediaDiariaUltimos7Dias(Integer idUsuario) {
        LocalDate hoje = LocalDate.now();
        LocalDate seteDiasAtras = hoje.minusDays(6);

        Double media = relatoriosRepository.calcularMediaUltimos7Dias(idUsuario, seteDiasAtras, hoje);

        return media != null ? media : 0.0;
    }

    // Média diária dos últimos 30 dias
    public Double mediaDiariaUltimos30Dias(Integer idUsuario) {
        Double media = relatoriosRepository.mediaUltimos30Dias(idUsuario);
        return media != null ? media : 0.0;
    }
}
