import React, { FormEvent, useState } from 'react';

import Image from 'next/image';

import { api } from '../api/api';
import avatares from '../assets/avatares.png';
import nlwcCopa from '../assets/nlw-copa.png';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const { poolCount, guessCount, usersCount } = props;

  const [value, setValue] = useState<string>('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post('/pools', {
        title: value,
      });
      const { code } = response.data;
      await navigator.clipboard.writeText(code);
      alert(
        'Bolão criado com sucesso, o código foi copiado para a área de transfêrencia!',
      );
      setValue('');
    } catch (err) {
      console.log(err);
      alert('Não foi possível criar o bolão!');
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={require('../assets/logo.svg')} alt="Logo" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={avatares} alt="Avatares" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{usersCount}</span> pessoas já
            estão usando
          </strong>
        </div>
        <form onSubmit={handleSubmit} className="mt-10 flex gap-2">
          <input
            value={value}
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type={'text'}
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={e => setValue(e.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type={'submit'}>
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100 pb-10">
          <div className="flex items-center gap-6">
            <Image src={require('../assets/check.svg')} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600 " />
          <div className="flex items-center gap-6">
            <Image src={require('../assets/check.svg')} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2-xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={nlwcCopa} alt={'Mobile'} quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] =
    await Promise.all([
      api.get('/pools/count'),
      api.get('guess/count'),
      api.get('users/count'),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
