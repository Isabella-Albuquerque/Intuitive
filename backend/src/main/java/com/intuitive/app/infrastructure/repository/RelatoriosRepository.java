package com.intuitive.app.infrastructure.repository;

import com.intuitive.app.infrastructure.entitys.Refeicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface RelatoriosRepository extends JpaRepository<Refeicao, Integer> {

    @Query("""
    SELECT COUNT(r) * 1.0 / COUNT(DISTINCT r.data)
    FROM Refeicao r
    WHERE r.usuario.id = :idUsuario
    AND r.data BETWEEN :inicio AND :fim
""")
    Double calcularMediaUltimos7Dias(@Param("idUsuario") Integer idUsuario,
                                     @Param("inicio") LocalDate inicio,
                                     @Param("fim") LocalDate fim);


    // Média diária de refeições nos últimos 30 dias
    @Query(
            value = """
        SELECT COUNT(*) * 1.0 / COUNT(DISTINCT r.data)
        FROM refeicao r
        WHERE r.id_usuario = :idUsuario
        AND r.data >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        """,
            nativeQuery = true
    )
    Double mediaUltimos30Dias(@Param("idUsuario") Integer idUsuario);

}
