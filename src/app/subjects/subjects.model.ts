import {Teacher} from "../teachers/teacher.model";

export class Subject {
  id?: number;
  subjectName: string;
  teacher: Teacher;

  constructor(subjectName: string, teacher: Teacher) {
    this.subjectName = subjectName;
    this.teacher = teacher;
  }

}
