import { AnyFunction, Ctor } from './common';

export class Ability {
  constructor(
    private user: Record<any, any>,
    private subjectPolicyDict: SubjectPolicyDict,
  ) {}

  can<S>(action: string, subject: InferSubject<S>): boolean {
    const subjectName = this.getSubjectName(subject);
    const policy = this.subjectPolicyDict[subjectName];

    if (!policy) {
      throw new PolicyNotFoundException(subjectName);
    }

    const policyMethod = policy[action] as AnyFunction<boolean>;

    if (!policyMethod) {
      throw new ActionNotFoundException(action);
    }

    return policyMethod.apply(policy, [this.user, subject]);
  }

  cannot<S>(action: string, subject: InferSubject<S>): boolean {
    return !this.can(action, subject);
  }

  private getSubjectName(subject: InferSubject<any>): string {
    if (typeof subject === 'string') {
      return subject;
    }

    if (typeof subject === 'object') {
      return subject.constructor.name;
    }

    return subject.name;
  }
}

export class PolicyNotFoundException extends Error {
  constructor(subject: string) {
    super(`Policy for subject "${subject}" does not found`);
  }
}

export class ActionNotFoundException extends Error {
  constructor(action: string) {
    super(`Action "${action}" does not found`);
  }
}

export interface SubjectPolicyDict {
  [key: string]: Record<string, any>;
}

export type InferSubject<S> = Ctor<S> | S | string;
