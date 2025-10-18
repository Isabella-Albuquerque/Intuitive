package com.intuitive.app.business.RelatoriosService;

import com.intuitive.app.DTO.RelatorioEmocoesDto;
import com.intuitive.app.infrastructure.repository.RelatoriosRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmocoesService {

    private final RelatoriosRepository repository;

    public EmocoesService(RelatoriosRepository repository) {
        this.repository = repository;
    }


    public RelatorioEmocoesDto contarUltimos7dias(Long idUsuario){
        LocalDate dataInicio = LocalDate.now().minusDays(7);
        RelatorioEmocoesDto dto = repository.contarEmocoesPorUsuario(dataInicio, idUsuario);
        return dto;
    }

    public RelatorioEmocoesDto contarUltimos30dias(Long idUsuario){
        LocalDate dataInicio = LocalDate.now().minusDays(30);
        RelatorioEmocoesDto dto = repository.contarEmocoesPorUsuario(dataInicio, idUsuario);
        return dto;
    }

}
