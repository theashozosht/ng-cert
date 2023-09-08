import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Category, Difficulty, ApiQuestion, Question, Results } from './data.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private API_URL = "https://opentdb.com/";
  private latestResults!: Results;
  private categoryFullList: Category[] = []
  private _canBeUpdated: boolean = false;
  get canBeUpdated(): boolean {
    return this._canBeUpdated;
  }

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php").pipe(
      tap(res => this.categoryFullList = res.trivia_categories),
      map(res => res.trivia_categories)
    );
  }

  createQuiz(amount: number, categoryId: string, difficulty: Difficulty): Observable<Question[]> {
    return this.http.get<{ results: ApiQuestion[] }>(
      `${this.API_URL}/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        tap(res => this._canBeUpdated = true),
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            { ...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1) }
          ));
          return quiz;
        })
      );
  }

  updateQuestion(categoryId: string, difficulty: Difficulty): Observable<Question> {
    return this.http.get<{ results: ApiQuestion[] }>(
      `${this.API_URL}/api.php?amount=1&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        tap(res => this._canBeUpdated = false),
        map(res => {
          return {
            ...res.results[0],
            all_answers: [
              ...res.results[0].incorrect_answers,
              res.results[0].correct_answer
            ]
          } as Question
        })
      );
  }



  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index])
        score++;
    })
    this.latestResults = { questions, answers, score };
  }

  findCategoryID(category: string): string {
    return this.categoryFullList.find(item => item.name == category)?.id.toString() ?? ''
  }

  getLatestResults(): Results {
    return this.latestResults;
  }
}
