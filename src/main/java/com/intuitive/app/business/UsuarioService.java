package com.intuitive.app.business;

import com.intuitive.app.infrastructure.entitys.Usuario;
import com.intuitive.app.infrastructure.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }


    //Métodos CRUD
    public void salvarUsuario(Usuario usuario) {
        repository.saveAndFlush(usuario);
    }

    public Usuario buscarUsuarioPorEmail(String email) {
        return  repository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("Email não encontrado")
        );
    }

    public void deletarUsuarioPorEmail(String email) {
    repository.delete(buscarUsuarioPorEmail(email));
    }

    public void atualizarUsuarioPorEmail(String email, Usuario usuario) {
        Usuario usuarioEntity = buscarUsuarioPorEmail(email);

        // Atualiza os campos somente se os valores novos não forem nulos
        if (usuario.getEmail() != null && !usuario.getEmail().isEmpty()) {
            usuarioEntity.setEmail(usuario.getEmail());
        }

        if (usuario.getNome() != null && !usuario.getNome().isEmpty()) {
            usuarioEntity.setNome(usuario.getNome());
        }

        if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
            usuarioEntity.setSenha(usuario.getSenha());
        }

        if (usuario.getSexo() != null && !usuario.getSexo().isEmpty()) {
            usuarioEntity.setSexo(usuario.getSexo());
        }

        if (usuario.getDtNascimento() != null) {
            usuarioEntity.setDtNascimento(usuario.getDtNascimento());
        }

        repository.saveAndFlush(usuarioEntity);
    }




}
