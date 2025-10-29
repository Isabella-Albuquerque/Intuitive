package com.intuitive.app.infrastructure.repository;

import com.intuitive.app.DTO.RelatorioDistracoesDto;
import com.intuitive.app.DTO.RelatorioEmocoesDto;
import com.intuitive.app.infrastructure.entitys.Refeicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface RelatoriosRepository extends JpaRepository<Refeicao, Integer> {


    //=================== MÉDIA DAS REFEIÇÕES ==============

    // Média diária de refeições nos últimos 7 dias

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

    // ============== DISTRAÇÕES =========================

    @Query("SELECT new com.intuitive.app.DTO.RelatorioDistracoesDto(" +
            "SUM(CASE WHEN r.distracoes = 'SIM' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.distracoes = 'NAO' THEN 1 ELSE 0 END), " +
            "'') " + // mensagem setada no Service
            "FROM Refeicao r " +
            "WHERE r.data >= :dataInicio AND r.usuario.id = :idUsuario")
    RelatorioDistracoesDto contarDistracoesPorUsuario(@Param("dataInicio") LocalDate dataInicio,
                                                      @Param("idUsuario") Long idUsuario);


    // =============== EMOÇÕES MAIS FREQUENTES ===================

    @Query("SELECT new com.intuitive.app.DTO.RelatorioEmocoesDto(" +
            "SUM(CASE WHEN r.emocoesAntes = 'FELIZ' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'TRISTE' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'CALMO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'ANSIOSO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'ESTRESSADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'NEUTRO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'CULPADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'FRUSTRADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'CANSADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'RELAXADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesAntes = 'ENTEDIADO' THEN 1 ELSE 0 END) " +
            ") " +
            "FROM Refeicao r " +
            "WHERE r.data >= :dataInicio AND r.usuario.id = :idUsuario")
    RelatorioEmocoesDto contarEmocoesAntesPorUsuario(@Param("dataInicio") LocalDate dataInicio,
                                                     @Param("idUsuario") Long idUsuario);


    @Query("SELECT new com.intuitive.app.DTO.RelatorioEmocoesDto(" +
            "SUM(CASE WHEN r.emocoesDepois = 'FELIZ' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'TRISTE' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'CALMO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'ANSIOSO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'ESTRESSADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'NEUTRO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'CULPADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'FRUSTRADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'CANSADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'RELAXADO' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN r.emocoesDepois = 'ENTEDIADO' THEN 1 ELSE 0 END) " +
            ") " +
            "FROM Refeicao r " +
            "WHERE r.data >= :dataInicio AND r.usuario.id = :idUsuario")
    RelatorioEmocoesDto contarEmocoesDepoisPorUsuario(@Param("dataInicio") LocalDate dataInicio,
                                                     @Param("idUsuario") Long idUsuario);

    //===================== MÉDIA DE FOME =============================
    @Query("""
       SELECT AVG(mediaDia)
       FROM (
           SELECT AVG(r.nivelFome) AS mediaDia
           FROM Refeicao r
           WHERE r.usuario.id = :idUsuario
           AND r.data BETWEEN :inicio AND :fim
           GROUP BY r.data
       ) AS medias
       """)
    Double calcularMediaFome(@Param("idUsuario") Integer idUsuario,
                                 @Param("inicio") LocalDate inicio,
                                 @Param("fim") LocalDate fim);

    //===================== MÉDIA DE FOME =============================
    @Query("""
       SELECT AVG(mediaDia)
       FROM (
           SELECT AVG(r.nivelSaciedade) AS mediaDia
           FROM Refeicao r
           WHERE r.usuario.id = :idUsuario
           AND r.data BETWEEN :inicio AND :fim
           GROUP BY r.data
       ) AS medias
       """)
    Double calcularMediaSaciedade(@Param("idUsuario") Integer idUsuario,
                             @Param("inicio") LocalDate inicio,
                             @Param("fim") LocalDate fim);


}

