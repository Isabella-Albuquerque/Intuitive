package com.intuitive.app.controller;

import com.intuitive.app.DTO.RefeicaoDto;
import com.intuitive.app.business.RefeicaoService;
import com.intuitive.app.infrastructure.entitys.Refeicao;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/refeicao")
@RequiredArgsConstructor
public class RefeicaoController {

    private final RefeicaoService refeicaoService;

    // Cadastrar nova refeição
    @PostMapping
    public ResponseEntity<RefeicaoDto> cadastrarRefeicao(@RequestBody RefeicaoDto dto) {
        RefeicaoDto salvo = refeicaoService.salvarRefeicao(dto);
        return ResponseEntity.ok(salvo);
    }

    // Consultar refeição por ID
    @GetMapping("/{id}")
    public ResponseEntity<RefeicaoDto> consultarRefeicao(@PathVariable Integer id) {
        RefeicaoDto refeicaoDTO = refeicaoService.consultarRefeicao(id);
        return ResponseEntity.ok(refeicaoDTO);
    }

    // Alterar refeição por ID
    @PutMapping("/{id}")
    public ResponseEntity<RefeicaoDto> atualizarRefeicao(@PathVariable Integer id, @RequestBody RefeicaoDto dto) {
        RefeicaoDto atualizado = refeicaoService.atualizarRefeicao(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    // Consultar histórico por usuário e mês
    @GetMapping("/historico")
    public ResponseEntity<List<RefeicaoDto>> historicoPorMes(
            @RequestParam Integer usuarioId,
            @RequestParam Integer mes,
            @RequestParam Integer ano) {
        List<RefeicaoDto> historico = refeicaoService.historicoPorMes(usuarioId, mes, ano);
        return ResponseEntity.ok(historico);
    }

    // Excluir refeição por ID
    @DeleteMapping("/{idRefeicao}")
    public ResponseEntity<Void> deletarRefeicao(@PathVariable Integer idRefeicao) {
        refeicaoService.deletarRefeicao(idRefeicao);
        return ResponseEntity.noContent().build();
    }
}
