import { Component, inject, Input } from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] | null = [];

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  updateQuestion(q: any): void {
    this.quizService.updateQuestion(this.quizService.findCategoryID(q.category), q.difficulty).subscribe(res => {
      if (!this.questions) return; // to avoid errors

      let index = this.questions?.findIndex(question => question.question === q.question)
      this.questions[index] = res
    })
  }

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

}
