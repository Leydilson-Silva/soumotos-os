import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-800">SOUMOTOS</h1>
        <p className="text-lg text-gray-500 mt-1">Sistema de Gestão da Oficina</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card
          href="/ordem-servico"
          icon="📝"
          title="Ordem de Serviço"
          description="Criar e gerenciar ordens de serviço."
        />
        <Card
          href="/matricula"
          icon="🎓"
          title="Matrícula de Aluno"
          description="Registrar novos alunos nos cursos."
        />
        <Card
          icon="🔧"
          title="Manutenção"
          description="Criar e gerenciar manutenções."
          disabled
        />
      </main>
    </div>
  );
}

interface CardProps {
  href?: string;
  icon: string;
  title: string;
  description: string;
  disabled?: boolean;
}

function Card({ href, icon, title, description, disabled = false }: CardProps) {
  const content = (
    <>
      <span className="text-5xl mb-4">{icon}</span>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </>
  );

  const className = `bg-white p-8 rounded-2xl shadow-md hover:shadow-blue-500/20 hover:border-blue-500/50 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center text-center ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  if (disabled || !href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
