import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { StatsService } from '../../service/stats-service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})
export class stats implements OnInit {

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    const from = "2025-01-01";
    const to = "2025-12-31";

    this.loadPostsByUser(from, to);
    this.loadCommentsCount(from, to);
    this.loadCommentsPerPost(from, to);
  }

  loadPostsByUser(from: string, to: string) {
    this.statsService.getPostsPerUser(from, to).subscribe((data: any[]) => {
      new Chart("postsByUserChart", {
        type: "bar",
        data: {
          labels: data.map(d => d.username),
          datasets: [{ data: data.map(d => d.count) }]
        }
      });
    });
  }

  loadCommentsCount(from: string, to: string) {
    this.statsService.getCommentsCount(from, to).subscribe((data: any) => {
      new Chart("commentsCountChart", {
        type: "line",
        data: {
          labels: ["Comentarios"],
          datasets: [{ data: [data.totalComments] }]
        }
      });
    });
  }

  loadCommentsPerPost(from: string, to: string) {
    this.statsService.getCommentsPerPost(from, to).subscribe((data: any[]) => {
      new Chart("commentsPerPostChart", {
        type: "pie",
        data: {
          labels: data.map(d => d.title.substring(0, 15) + "..."),
          datasets: [{ data: data.map(d => d.count) }]
        }
      });
    });
  }
}
