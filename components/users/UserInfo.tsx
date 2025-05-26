'use client';

import { useEffect, useState } from 'react';

function UserInfo() {
  const [user, setUser] = useState<any>(null);  // Đổi thành null thay vì mảng rỗng để dễ kiểm tra

  const fetchAuthUser = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.status === 401) {
        window.location.href = '/sign-in';
        return;
      }

      if (res.status === 403) {
        window.location.href = '/profile/create';
        return;
      }

      const data = await res.json();
      setUser(data); // Lưu toàn bộ dữ liệu vào state
      console.log('User data from API:', data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  if (!user) {
    return <div>Loading user...</div>;
  }

  // Đảm bảo user có dữ liệu hợp lệ để render
  return (
    <div>
      <h1>Thông tin người dùng:</h1>
      <p>ID:{user.id}</p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Tên:</strong> {user?.name} 
      </p>
    </div>
  );
}

export default UserInfo;
