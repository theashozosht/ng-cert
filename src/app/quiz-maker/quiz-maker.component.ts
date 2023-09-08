import { Component } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, of } from 'rxjs';
import { QuizService } from '../quiz.service';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { DropdownOption } from './types';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {
  questions$!: Observable<Question[]>;
  categories$: Observable<Category[]>;
  subCategories$: Observable<DropdownOption[]> = of([
    { name: 'Entertainment' },
    { name: 'Science' }
  ])

  currentSubCategory$ = new Subject<string>();
  category: Category = { name: '', id: 0 }
  subCategory: DropdownOption = { name: '' }
  categorySelect: FormControl = new FormControl<string>('');


  constructor(protected quizService: QuizService) {
    this.categories$ = this.currentSubCategory$.asObservable().pipe(
      switchMap(res =>
        quizService.getAllCategories().pipe(
          map(item =>
            item.filter(_item => _item.name.includes(res))
          ),
        )
      )
    )
  }

  createQuiz(cat: number, difficulty: string): void {
    this.questions$ = this.quizService.createQuiz(5, cat.toString(), difficulty as Difficulty);
  }

  updateFilters(event: DropdownOption): void {
    this.subCategory = event
    this.currentSubCategory$.next(event.name)
  }
}
