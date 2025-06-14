'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { actionFunction } from '@/utils/types';

const initialState = {
  message: '',
  redirectUrl: '', // 👈 thêm redirect hỗ trợ
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }

    if (state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, toast, router]);

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;
