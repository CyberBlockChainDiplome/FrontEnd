import {Teacher} from "../teachers/teacher.model";
import {Student} from "../students/student.model";
import {Subject} from "../subjects/subjects.model";

export class Grade {
  id?: number;
  value: number;
  student: Student;
  subject: Subject;

  constructor(value: number, student: Student, subject: Subject) {
    this.value = value;
    this.student = student;
    this.subject = subject;
  }

}
