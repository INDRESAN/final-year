import axios, { AxiosInstance } from 'axios';

// Vite exposes environment variables via `import.meta.env` in the browser.
// Use `VITE_API_URL` to override the default during development/production.
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api';

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  admin_username?: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  matched_user?: string | null;
  similarity_score?: number | null;
  data_integrity?: boolean | null;
  database_status?: string;
  is_database_clean?: boolean;
  tampering_percentage?: number;
}

export interface UsersResponse {
  users: string[];
  total_count: number;
}

export interface EnrollmentStatusResponse {
  locked: boolean;
  message: string;
}

class FaceRecognitionAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await this.client.post<AdminLoginResponse>('/admin/login', credentials);
    return response.data;
  }

  async changePassword(adminUsername: string, oldPassword: string, newPassword: string) {
    const response = await this.client.post('/admin/change-password', null, {
      params: {
        admin_username: adminUsername,
        old_password: oldPassword,
        new_password: newPassword,
      },
    });
    return response.data;
  }

  async verifyFace(imageBase64: string): Promise<VerificationResponse> {
    const response = await this.client.post<VerificationResponse>('/verify', {
      image_base64: imageBase64,
    });
    return response.data;
  }

  async enrollUser(username: string, adminUsername: string, imageBase64: string) {
    const response = await this.client.post('/enroll', {
      username,
      admin_username: adminUsername,
      image_base64: imageBase64,
    });
    return response.data;
  }

  async getUsers(): Promise<UsersResponse> {
    const response = await this.client.get<UsersResponse>('/users');
    return response.data;
  }

  async deleteUser(username: string) {
    const response = await this.client.delete(`/users/${username}`);
    return response.data;
  }

  async getEnrollmentStatus(): Promise<EnrollmentStatusResponse> {
    const response = await this.client.get<EnrollmentStatusResponse>('/enrollment/status');
    return response.data;
  }

  async lockEnrollment() {
    const response = await this.client.post('/enrollment/lock');
    return response.data;
  }

  async unlockEnrollment() {
    const response = await this.client.post('/enrollment/unlock');
    return response.data;
  }

  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const api = new FaceRecognitionAPI();
