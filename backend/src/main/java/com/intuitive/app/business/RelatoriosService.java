package com.intuitive.app.business;

import com.intuitive.app.infrastructure.repository.RelatoriosRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.YearMonth;


@Service
public class RelatoriosService {

    @Autowired
    private RelatoriosRepository relatoriosRepository;

    // Média diária da semana
    public Double mediaDiariaSemana(Integer idUsuario, int ano, int semana) {
        Double totalRefeicoes = relatoriosRepository.contarPorUsuarioPorSemana(idUsuario, ano, semana);

        // Número de dias na semana (sempre 7)
        int diasSemana = 7;

        return totalRefeicoes.doubleValue() / diasSemana;
    }

    // Média diária do mês
    public Double mediaDiariaMes(Integer idUsuario, int ano, int mes) {
        Double totalRefeicoes = relatoriosRepository.contarPorUsuarioPorMes(idUsuario, ano, mes);

        // Número de dias do mês
        YearMonth yearMonth = YearMonth.of(ano, mes);
        int diasMes = yearMonth.lengthOfMonth();

        return totalRefeicoes.doubleValue() / diasMes;
    }
}
