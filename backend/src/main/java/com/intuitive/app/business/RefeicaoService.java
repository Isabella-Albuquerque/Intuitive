package com.intuitive.app.business;

import com.intuitive.app.DTO.RefeicaoDto;
import com.intuitive.app.DTO.UsuarioDto;
import com.intuitive.app.infrastructure.entitys.Refeicao;
import com.intuitive.app.infrastructure.entitys.Usuario;
import com.intuitive.app.infrastructure.repository.RefeicaoRepository;
import com.intuitive.app.infrastructure.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefeicaoService {

    private final RefeicaoRepository repository;
    private final UsuarioRepository usuarioRepository;

    // ===================== Cadastro =====================
    public RefeicaoDto salvarRefeicao(RefeicaoDto dto) {
        validarCamposObrigatorios(dto);

        Usuario usuario = usuarioRepository.findById(dto.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Refeicao refeicao = toEntity(dto, usuario);
        Refeicao salvo = repository.save(refeicao);

        return toDTO(salvo);
    }

    // ===================== Consulta por ID =====================
    public RefeicaoDto consultarRefeicao(Integer idRefeicao) {
        Refeicao refeicao = repository.findById(idRefeicao)
                .orElseThrow(() -> new RuntimeException("Refeição não encontrada"));
        return toDTO(refeicao);
    }

    // ===================== Atualização =====================
    public RefeicaoDto atualizarRefeicao(Integer id, RefeicaoDto dto) {
        Refeicao refeicaoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refeição não encontrada"));

        validarCamposObrigatorios(dto);

        Usuario usuario = usuarioRepository.findById(dto.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        refeicaoExistente.setTipo(dto.getTipo());
        refeicaoExistente.setDescricao(dto.getDescricao());
        refeicaoExistente.setData(dto.getData());
        refeicaoExistente.setHorario(dto.getHorario());
        refeicaoExistente.setNivelFome(dto.getNivelFome());
        refeicaoExistente.setNivelSaciedade(dto.getNivelSaciedade());
        refeicaoExistente.setCompanhia(dto.getCompanhia());
        refeicaoExistente.setDistracoes(dto.getDistracoes());
        refeicaoExistente.setEmocoesAntes(dto.getEmocoesAntes());
        refeicaoExistente.setEmocoesDepois(dto.getEmocoesDepois());
        refeicaoExistente.setUsuario(usuario);

        Refeicao atualizada = repository.save(refeicaoExistente);

        return toDTO(atualizada);
    }

    // ===================== Histórico por mês =====================
    public List<RefeicaoDto> historicoPorMes(Integer usuarioId, int mes, int ano) {
        List<Refeicao> lista = repository.findByUsuarioAndMes(usuarioId, mes, ano);
        return lista.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ===================== Delete =====================
    public void deletarRefeicao(Integer idRefeicao) {
        Refeicao refeicao = repository.findById(idRefeicao)
                .orElseThrow(() -> new RuntimeException("Refeição não encontrada"));
        repository.delete(refeicao);
    }

    // ===================== Conversão DTO ↔ Entity =====================
    private RefeicaoDto toDTO(Refeicao refeicao) {
        if (refeicao == null)
            return null;

        Usuario usuario = refeicao.getUsuario();
        UsuarioDto usuarioDTO = null;
        if (usuario != null) {
            usuarioDTO = new UsuarioDto();
            usuarioDTO.setId(usuario.getId());
            usuarioDTO.setNome(usuario.getNome());
            usuarioDTO.setEmail(usuario.getEmail());
        }

        return new RefeicaoDto(
                refeicao.getIdRefeicao(),
                refeicao.getData(),
                refeicao.getHorario(),
                refeicao.getTipo(),
                refeicao.getDescricao(),
                refeicao.getNivelFome(),
                refeicao.getCompanhia(),
                refeicao.getDistracoes(),
                refeicao.getEmocoesAntes(),
                refeicao.getEmocoesDepois(),
                refeicao.getNivelSaciedade(),
                usuarioDTO);
    }

    private Refeicao toEntity(RefeicaoDto dto, Usuario usuario) {
        return Refeicao.builder()
                .idRefeicao(dto.getIdRefeicao())
                .tipo(dto.getTipo())
                .descricao(dto.getDescricao())
                .data(dto.getData())
                .horario(dto.getHorario())
                .nivelFome(dto.getNivelFome())
                .nivelSaciedade(dto.getNivelSaciedade())
                .companhia(dto.getCompanhia())
                .distracoes(dto.getDistracoes())
                .emocoesAntes(dto.getEmocoesAntes())
                .emocoesDepois(dto.getEmocoesDepois())
                .usuario(usuario)
                .build();
    }

    // ===================== Validação de Campos =====================
    private void validarCamposObrigatorios(RefeicaoDto dto) {
        if (dto.getUsuario() == null || dto.getUsuario().getId() == null) {
            throw new IllegalArgumentException("Usuário inválido");
        }
        if (dto.getData() == null) {
            throw new IllegalArgumentException("Você deve informar a data da refeição");
        }
        if (dto.getHorario() == null) {
            throw new IllegalArgumentException("Você deve informar o horário da refeição");
        }
        if (dto.getTipo() == null || dto.getTipo().isEmpty()) {
            throw new IllegalArgumentException("Você deve informar o tipo da refeição");
        }
        if (dto.getNivelFome() == null) {
            throw new IllegalArgumentException("Você deve informar o nível de fome");
        }
        if (dto.getNivelSaciedade() == null) {
            throw new IllegalArgumentException("Você deve informar o nível de saciedade");
        }
    }
}
