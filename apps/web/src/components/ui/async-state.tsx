type Props = {
  isLoading?: boolean;
  isEmpty?: boolean;
  loadingText?: string;
  emptyText?: string;
  children: React.ReactNode;
};

export function AsyncState({
  isLoading,
  isEmpty,
  loadingText = 'Carregando...',
  emptyText = 'Nenhum dado encontrado',
  children,
}: Props) {
  if (isLoading) {
    return <div className="text-muted-foreground">{loadingText}</div>;
  }

  if (isEmpty) {
    return <div className="text-muted-foreground">{emptyText}</div>;
  }

  return <>{children}</>;
}
