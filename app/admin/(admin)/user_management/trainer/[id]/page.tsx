"use client"
import { useParams } from 'next/navigation';
import TabChangeComponents from '@/components/layout/TabChangeComponents';
import React from 'react';

function UserPage() {
  const params = useParams();
  console.log(params , 'params');

  return (
    <div>
      <TabChangeComponents />
    </div>
  );
}

export default UserPage;
