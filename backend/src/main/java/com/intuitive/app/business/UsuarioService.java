package com.intuitive.app.business;

import com.intuitive.app.infrastructure.entitys.Usuario;
import com.intuitive.app.infrastructure.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    // Regex simples para validação de email
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    // ===================== CRUD =====================

    public void salvarUsuario(Usuario usuario) {
        validarCamposObrigatorios(usuario);
        validarEmail(usuario.getEmail());
        validarDtNascimento(usuario.getDtNascimento());

        if (repository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está em uso");
        }

        repository.saveAndFlush(usuario);
    }

    public Usuario buscarUsuarioPorEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public void deletarUsuarioPorEmail(String email) {
        Usuario usuario = buscarUsuarioPorEmail(email);
        repository.delete(usuario);
    }

    public void atualizarUsuarioPorEmail(String email, Usuario usuarioAtualizado) {
        Usuario usuarioExistente = buscarUsuarioPorEmail(email);

        // Valida email se for alterado
        if (usuarioAtualizado.getEmail() != null && !usuarioAtualizado.getEmail().isEmpty()) {
            validarEmail(usuarioAtualizado.getEmail());
            if (!usuarioAtualizado.getEmail().equals(email) &&
                    repository.findByEmail(usuarioAtualizado.getEmail()).isPresent()) {
                throw new IllegalArgumentException("E-mail já cadastrado");
            }
            usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        }

        // Atualiza outros campos se não forem nulos
        if (usuarioAtualizado.getNome() != null && !usuarioAtualizado.getNome().isEmpty()) {
            usuarioExistente.setNome(usuarioAtualizado.getNome());
        }

        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isEmpty()) {
            usuarioExistente.setSenha(usuarioAtualizado.getSenha());
        }

        if (usuarioAtualizado.getSexo() != null && !usuarioAtualizado.getSexo().isEmpty()) {
            usuarioExistente.setSexo(usuarioAtualizado.getSexo());
        }

        if (usuarioAtualizado.getDtNascimento() != null) {
            validarDtNascimento(usuarioAtualizado.getDtNascimento());
            usuarioExistente.setDtNascimento(usuarioAtualizado.getDtNascimento());
        }

        repository.saveAndFlush(usuarioExistente);
    }

    // ===================== LOGIN =====================
    public Usuario login(String email, String senha) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        if (senha == null || senha.isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("E-mail inválido");
        }

        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas"));

        if (!usuario.getSenha().equals(senha)) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        return usuario; // Aqui poderia retornar um token em uma implementação real
    }

    // ===================== VALIDAÇÕES =====================

    private void validarCamposObrigatorios(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        if (usuario.getSenha() == null || usuario.getSenha().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }
        if (usuario.getSexo() == null || usuario.getSexo().isEmpty()) {
            throw new IllegalArgumentException("Sexo é obrigatório");
        }
        if (usuario.getDtNascimento() == null) {
            throw new IllegalArgumentException("Data de nascimento é obrigatória");
        }
    }

    private void validarEmail(String email) {
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("E-mail inválido");
        }
    }

    private void validarDtNascimento(Date dtNascimento) {
        Date today = new Date();
        if (dtNascimento.after(today)) {
            throw new IllegalArgumentException("Data de nascimento deve ser no passado");
        }
    }
}
