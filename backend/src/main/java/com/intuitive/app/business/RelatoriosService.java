package com.intuitive.app.business;

import com.intuitive.app.infrastructure.repository.RelatoriosRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.YearMonth;


@Service
public class RelatoriosService {

    @Autowired
    private RelatoriosRepository relatoriosRepository;

    // Média diária dos últimos 7 dias (excluindo dias sem registro)
    public Double mediaDiariaUltimos7Dias(Integer idUsuario) {
        LocalDate hoje = LocalDate.now();
        LocalDate seteDiasAtras = hoje.minusDays(6); // conta o dia atual também

        Double media = relatoriosRepository.calcularMediaUltimos7Dias(idUsuario, seteDiasAtras, hoje);

        // se o usuário não tiver refeições registradas no período, retorna 0.0
        return media != null ? media : 0.0;
    }


    // Média diária dos últimos 30 dias
    public Double mediaDiariaUltimos30Dias(Integer idUsuario) {
        Double media = relatoriosRepository.mediaUltimos30Dias(idUsuario);
        return media != null ? media : 0.0;
    }
}
