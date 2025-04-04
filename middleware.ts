import { NextResponse } from 'next/server';
import { getCurrentUserDetail } from './Auth';
import { AxiosGet } from './common/api/axiosService';
import { API_URLS } from './common/api/constants';

interface Permission {
    VIEW?: boolean;
    MAIN_VIEW?: boolean;
    subModule?: Record<string, Permission>;
  }
   
type Permissions = Record<string, Permission>;

const publicRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password", "/admin/role", "/admin/sign-up", "/admin/success", "/admin/thank-you"];

async function fetchPermissions() {
    try {
        const response = await AxiosGet(`${API_URLS.AUTH.SIDEBAR_LIST}`);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return null;
    }
}

function normalizeModuleName(name:any) {
    return name ? name.replace(/-/g, '_') : '';
}

function hasPermission(permissions: Permissions[], route: string): boolean {
    // Extract the path after '/admin' (e.g., /admin/users -> users)
    const adminPath = route.startsWith('/admin') ? route.slice(6) : '';
    const modulename = adminPath === '' ? 'dashboard' : normalizeModuleName(adminPath.split('/')[1]);

    function checkPermission(permissionObject: Permissions, modulename: string): boolean {
        if (permissionObject[modulename]) {
            return permissionObject[modulename].VIEW === true || permissionObject[modulename].MAIN_VIEW === true;
        }
        for (const key in permissionObject) {
            if (permissionObject[key]?.subModule) {
                if (checkPermission(permissionObject[key].subModule as Permissions, modulename)) {
                    return true;
                }
            }
        }
        return false;
    }

    return permissions.some(permissionObject => checkPermission(permissionObject, modulename));
}


export async function middleware(request:any) {
    const path = request.nextUrl.pathname;
    const currentUser = await getCurrentUserDetail();
    const isAuthenticated = !!currentUser?.token;

    const isPublicPath = publicRoutes.some(route => path.startsWith(route) || path.match(/^\/reset-password\/[^\/]+$/));

    if (isAuthenticated && path === '/admin/login') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    if (!isPublicPath && path.startsWith('/admin')) {
        let permissions = await fetchPermissions();
        if (!permissions || !hasPermission(permissions, path)) {
            // Retry fetching permissions
            permissions = await fetchPermissions();
            if (!permissions || !hasPermission(permissions, path)) {
                console.log('Access denied after retrying for:', path);
                if (path !== '/access-denied') {
                    return NextResponse.redirect(new URL('/access-denied', request.url));
                }
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff)$).*)',
        '/',
    ],
};
