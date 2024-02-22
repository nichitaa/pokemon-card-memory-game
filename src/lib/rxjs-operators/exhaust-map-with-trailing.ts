import { asyncScheduler, defer, Observable, ObservableInput, OperatorFunction, scheduled, Subject } from 'rxjs';
import { exhaustMap, finalize, throttle } from 'rxjs';

/**
 * Reference: https://github.com/bjoerge/rxjs-exhaustmap-with-trailing/blob/main/index.ts
 */

export function exhaustMapWithTrailing<T, R>(
  project: (value: T, index: number) => ObservableInput<R>
): OperatorFunction<T, R> {
  return (source): Observable<R> =>
    defer(() => {
      const release = new Subject<void>();
      return source.pipe(
        throttle(() => release, {
          leading: true,
          trailing: true,
        }),
        exhaustMap((value, index) =>
          scheduled(project(value, index), asyncScheduler).pipe(
            finalize(() => {
              release.next();
            })
          )
        )
      );
    });
}

export function exhaustMapToWithTrailing<T, R>(innerObservable: Observable<R>): OperatorFunction<T, R> {
  return exhaustMapWithTrailing(() => innerObservable);
}
