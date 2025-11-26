import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { StatsService } from '../../service/stats-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stats',
  imports: [FormsModule],
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})
export class Stats implements OnInit {

  // Instancias de los gráficos (para poder actualizarlos/destruirlos)
  private chartPosts: Chart | undefined;
  private chartCommentsCount: Chart | undefined;
  private chartCommentsPerPost: Chart | undefined;

  // Variables para las fechas (Inicializadas con valores por defecto)
  // Gráfico 1
  postsFrom: string = '2025-01-01';
  postsTo: string = '2025-12-31';

  // Gráfico 2
  commentsCountFrom: string = '2025-01-01';
  commentsCountTo: string = '2025-12-31';

  // Gráfico 3
  commentsPerPostFrom: string = '2025-01-01';
  commentsPerPostTo: string = '2025-12-31';

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    // Carga inicial de todos los gráficos
    this.loadPostsByUser();
    this.loadCommentsCount();
    this.loadCommentsPerPost();
  }

  // --- GRÁFICO 1: Publicaciones por Usuario ---
  loadPostsByUser() {
    this.statsService.getPostsPerUser(this.postsFrom, this.postsTo).subscribe((data: any[]) => {

      // 1. Si ya existe un gráfico, lo destruimos para limpiar el canvas
      if (this.chartPosts) this.chartPosts.destroy();

      // 2. Creamos el nuevo gráfico
      this.chartPosts = new Chart("postsByUserChart", {
        type: "line",
        data: {
          labels: data.map(d => d.username),
          datasets: [{
            label: 'Publicaciones',
            data: data.map(d => d.count),
            borderColor: '#3B82F6', // Azul Tailwind
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4 // Curvas suaves
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    });
  }

  // --- GRÁFICO 2: Total de Comentarios ---
  loadCommentsCount() {
    this.statsService.getCommentsCount(this.commentsCountFrom, this.commentsCountTo).subscribe((data: any) => {

      if (this.chartCommentsCount) this.chartCommentsCount.destroy();

      this.chartCommentsCount = new Chart("commentsCountChart", {
        type: "bar",
        data: {
          labels: ["Total Comentarios"],
          datasets: [{
            label: 'Cantidad',
            data: [data.totalComments],
            backgroundColor: ['#10B981'], // Verde Tailwind
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
  }

  // --- GRÁFICO 3: Comentarios por Publicación ---
  loadCommentsPerPost() {
    this.statsService.getCommentsPerPost(this.commentsPerPostFrom, this.commentsPerPostTo).subscribe((data: any[]) => {

      if (this.chartCommentsPerPost) this.chartCommentsPerPost.destroy();

      this.chartCommentsPerPost = new Chart("commentsPerPostChart", {
        type: "doughnut", // Doughnut se ve más moderno que Pie
        data: {
          labels: data.map(d => d.title.substring(0, 15) + "..."),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: [
              '#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6', '#10B981' // Paleta de colores variada
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    });
  }
}