package com.intuitive.app.infrastructure.repository;

import com.intuitive.app.infrastructure.entitys.Refeicao;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
@Repository

public interface RefeicaoRepository extends JpaRepository<Refeicao, Integer> {

    @Transactional
    void deleteByIdRefeicao(Integer idRefeicao);

    // Consulta refeições por usuário e data exata
    List<Refeicao> findByUsuarioIdAndData(Integer usuarioId, Date data);

    // Consulta refeições por usuário e mês/ano
    @Query("SELECT r FROM Refeicao r " +
            "WHERE r.usuario.id = :usuarioId " +
            "AND FUNCTION('MONTH', r.data) = :mes " +
            "AND FUNCTION('YEAR', r.data) = :ano " +
            "ORDER BY r.data DESC, r.horario DESC")
    List<Refeicao> findByUsuarioAndMes(Integer usuarioId, int mes, int ano);
}
