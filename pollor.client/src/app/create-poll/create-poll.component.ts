import { Component } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiService } from '../_api/api.service';
import { finalize } from 'rxjs';
import { AlertMessage } from '../alert-message/alert-message';
import { ICreatePoll } from '../_interfaces/polls.interface';
import { ICreateAnswer } from "../_interfaces/answers.interface";

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.css'
})
export class CreatePollComponent {
  createPollError: string = '';
  loading: boolean = false;
  createPollForm!: FormGroup;

  dateModel: Date = new Date();
  stringDateModel: string = new Date().toString();

  initClosingDate: Date = new Date(new Date(2000, 0, 1, 1));

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertMessage: AlertMessage
  ) {
    this.createPollForm = this.initForm();

    this.addAnswer();
    this.addAnswer();
  }

  initForm() {
    return this.fb.group({
      pollQuestion: new FormControl(null, [Validators.required, Validators.maxLength(512)]),
      pollAnswers: new FormArray([]),
      pollClosingDate: new FormControl(this.initClosingDate, [Validators.required])
    },
      {
        validators: [
          this.ExtraAnswerValidation('pollAnswers'),
          this.DateTimeValidator('pollClosingDate')
        ]
      } as AbstractControlOptions
    );
  }

  addAnswer() {
    const answerForm = this.fb.group({
      answer: new FormControl('', [Validators.required, Validators.maxLength(256)])
    });
    this.pollAnswers.push(answerForm);
  }

  deleteAnswer(answerIndex: number) {
    this.pollAnswers.removeAt(answerIndex);
  }

  get pollQuestion(): AbstractControl { return this.createPollForm.get('pollQuestion')!; }
  get pollClosingDate(): AbstractControl { return this.createPollForm.get('pollClosingDate')!; }
  get pollAnswers() {
    return this.createPollForm.controls['pollAnswers'] as FormArray;
  }

  DateTimeValidator(dateTime: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[dateTime];

      if (
        control.errors &&
        !control.errors.nonValidDate &&
        !control.errors.closingDateNotSelectedYet &&
        !control.errors.closingDateIsThePast
      ) {
        return;
      }

      if (control.value == this.initClosingDate) {
        control.setErrors({ closingDateNotSelectedYet: true });
        return;
      } else {
        control.setErrors(null);
      }

      const closingDate = new Date(control.value);
      const now = new Date(Date.now());

      if (closingDate.getTime() < now.getTime()) {
        control.setErrors({ closingDateIsThePast: true });
        return;
      } else {
        control.setErrors(null);
      }

      const isValid = !isNaN(closingDate.valueOf());
      if (!isValid) {
        control.setErrors({ nonValidDate: true });
      } else {
        control.setErrors(null);
      }
    };
  }

  ExtraAnswerValidation(fieldName: string) {
    return (formGroup: FormGroup) => {
      const answers = formGroup.controls[fieldName];

      if (
        answers.errors &&
        !answers.errors.tooShortLength
      ) {
        return;
      }
      if (answers.value.length < 2) {
        answers.setErrors({ tooShortLength: true });
      } else {
        answers.setErrors(null);
      }
    };
  }

  createPoll(): void {
    if (this.createPollForm.valid) {
      const newAnswers: ICreateAnswer[] = [];

      this.createPollForm.value.pollAnswers.forEach(function (value: any) {
        console.log(value.answer);
        newAnswers.push(
          {
              poll_answer: value.answer
          });
      });

      const newPoll: ICreatePoll = {
        question: this.createPollForm.value.pollQuestion,
        ending_date: this.createPollForm.value.pollClosingDate,
        answers: newAnswers
      };

      this.loading = true; // Start the loading spinner
      this.apiService
        .post('api/poll', newPoll)
        .pipe(
          finalize(() => {
            this.loading = false; //Stop the loading spinner
          })
        )
        .subscribe({
          next: (res: any) => {
            this.createPollError = '';
            this.initForm();
            this.alertMessage.addSuccessAlert("Poll has been created", `Poll '${res.question}' has been created!`);
          },
          error: (err: any) => {
            const msg = ((err.error && err.error.message) ? err.error.message : err.message);
            this.createPollError = err.status + ' - ' + msg;
            console.error('Poll Creation Error:', err);
            this.alertMessage.addErrorAlert("Poll Creation Error", msg);
          },
        });
    }
  }
}
