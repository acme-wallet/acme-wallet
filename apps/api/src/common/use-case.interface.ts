export interface IUseCase<TInput, TOutput> {
  execute(
    ...args: TInput extends void ? [] : [TInput]
  ): Promise<TOutput> | TOutput;
}
