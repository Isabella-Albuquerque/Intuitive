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
        dto.setMensagem("Últimos 7 dias");
        return dto;
    }

    public RelatorioDistracoesDto contarUltimos30Dias(Long idUsuario) {
        LocalDate dataInicio = LocalDate.now().minusDays(30);
        RelatorioDistracoesDto dto = repository.contarDistracoesPorUsuario(dataInicio, idUsuario);
        dto.setMensagem("Últimos 30 dias");
        return dto;
    }
}