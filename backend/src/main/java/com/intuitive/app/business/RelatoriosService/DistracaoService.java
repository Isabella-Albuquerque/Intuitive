package com.intuitive.app.business.RelatoriosService;

import com.intuitive.app.DTO.RelatorioDistracoesDto;
import com.intuitive.app.infrastructure.repository.RelatoriosRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DistracaoService {

    private final RelatoriosRepository repository;

    public DistracaoService(RelatoriosRepository repository) {
        this.repository = repository;
    }

    public RelatorioDistracoesDto contarUltimos7Dias(Long idUsuario) {
        LocalDate dataInicio = LocalDate.now().minusDays(7);
        RelatorioDistracoesDto dto = repository.contarDistracoesPorUsuario(dataInicio, idUsuario);
        dto.setMensagem(setaMensagemAviso(dto.getCountSim(), dto.getCountNao()));
        return dto;
    }

    public RelatorioDistracoesDto contarUltimos30Dias(Long idUsuario) {
        LocalDate dataInicio = LocalDate.now().minusDays(30);
        RelatorioDistracoesDto dto = repository.contarDistracoesPorUsuario(dataInicio, idUsuario);
        dto.setMensagem(setaMensagemAviso(dto.getCountSim(), dto.getCountNao()));
        return dto;
    }



    private String setaMensagemAviso (Long countSim, Long countNao){
        long total = countSim + countNao;

        if (total == 0) {
            return "Ainda não há registros suficientes para gerar um relatório.";
        }

        double proporcaoSim = (double) countSim / total;

        if (proporcaoSim > 0.8) {
            return "Atenção: você tem feito a maioria das suas refeições com distrações. Tente se desconectar e focar mais na sua alimentação para aproveitar melhor esse momento.";
        } else if (proporcaoSim > 0.5) {
            return "Percebe-se que frequentemente você se distrai durante as refeições. Que tal tentar diminuir gradualmente essas distrações?";
        } else {
            return "Você realiza a maior parte das suas refeições com atenção e presença. Continue assim!";
        }
    }
}