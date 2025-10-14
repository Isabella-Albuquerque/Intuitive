package com.intuitive.app.infrastructure.repository;

import com.intuitive.app.infrastructure.entitys.Refeicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RelatoriosRepository extends JpaRepository<Refeicao, Integer> {

    // Média diária de refeições por semana
    @Query("SELECT COUNT(r) * 1.0 / COUNT(DISTINCT r.data) " +
            "FROM Refeicao r " +
            "WHERE r.usuario.id = :idUsuario " +
            "AND FUNCTION('YEAR', r.data) = :ano " +
            "AND FUNCTION('WEEK', r.data) = :semana")
    Double contarPorUsuarioPorSemana (@Param("idUsuario") Integer idUsuario,
                                @Param("ano") int ano,
                                @Param("semana") int semana);

    // Média diária de refeições por mês
    @Query("SELECT COUNT(r) * 1.0 / COUNT(DISTINCT r.data) " +
            "FROM Refeicao r " +
            "WHERE r.usuario.id = :idUsuario " +
            "AND FUNCTION('YEAR', r.data) = :ano " +
            "AND FUNCTION('MONTH', r.data) = :mes")
    Double contarPorUsuarioPorMes (@Param("idUsuario") Integer idUsuario,
                             @Param("ano") int ano,
                             @Param("mes") int mes);
}
