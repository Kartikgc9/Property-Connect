declare module 'react-map-gl';
declare module 'lucide-react';
declare module 'mapbox-gl';

// External module declarations for packages without TypeScript support

declare module 'mapbox-gl' {
  export interface MapboxOptions {
    container: string | HTMLElement;
    style?: string;
    center?: [number, number];
    zoom?: number;
    accessToken?: string;
  }
  
  export class Map {
    constructor(options: MapboxOptions);
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    addControl(control: any): void;
    removeControl(control: any): void;
    getCanvas(): HTMLCanvasElement;
    getContainer(): HTMLElement;
    getBounds(): any;
    setCenter(center: [number, number]): void;
    setZoom(zoom: number): void;
    flyTo(options: any): void;
    remove(): void;
  }
  
  export class Marker {
    constructor(options?: any);
    setLngLat(lngLat: [number, number]): Marker;
    addTo(map: Map): Marker;
    remove(): Marker;
  }
  
  export class Popup {
    constructor(options?: any);
    setLngLat(lngLat: [number, number]): Popup;
    setHTML(html: string): Popup;
    addTo(map: Map): Popup;
    remove(): Popup;
  }
}

declare module 'react-map-gl' {
  import { ComponentType } from 'react';
  
  export interface MapProps {
    mapboxAccessToken?: string;
    initialViewState?: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
    mapStyle?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onViewStateChange?: (evt: any) => void;
    onClick?: (evt: any) => void;
  }
  
  export interface MarkerProps {
    longitude: number;
    latitude: number;
    anchor?: string;
    children?: React.ReactNode;
    onClick?: (evt: any) => void;
  }
  
  export const Map: ComponentType<MapProps>;
  export const Marker: ComponentType<MarkerProps>;
  export default Map;
}

declare module 'react-hook-form' {
  export interface UseFormReturn<T = any> {
    register: (name: string, options?: any) => any;
    handleSubmit: (callback: (data: T) => void) => (e?: React.FormEvent) => void;
    formState: {
      errors: Record<string, any>;
      isSubmitting: boolean;
      isValid: boolean;
    };
    setValue: (name: string, value: any) => void;
    getValues: () => T;
    reset: (data?: T) => void;
  }
  
  export function useForm<T = any>(options?: any): UseFormReturn<T>;
}

declare module 'react-hot-toast' {
  export interface ToastOptions {
    duration?: number;
    position?: string;
    style?: React.CSSProperties;
    className?: string;
    icon?: React.ReactNode;
    iconTheme?: any;
    ariaProps?: any;
  }
  
  export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'loading' | 'blank';
    visible: boolean;
    duration?: number;
    position?: string;
    style?: React.CSSProperties;
    className?: string;
    icon?: React.ReactNode;
    iconTheme?: any;
    ariaProps?: any;
  }
  
  export function toast(message: string, options?: ToastOptions): string;
  export namespace toast {
    export function success(message: string, options?: ToastOptions): string;
    export function error(message: string, options?: ToastOptions): string;
    export function loading(message: string, options?: ToastOptions): string;
    export function custom(jsx: React.ReactNode, options?: ToastOptions): string;
    export function dismiss(toastId?: string): void;
    export function remove(toastId?: string): void;
  }
  
  export const Toaster: React.ComponentType<any>;
}

declare module 'framer-motion' {
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    whileHover?: any;
    whileTap?: any;
    drag?: boolean | string;
    dragConstraints?: any;
    onDragEnd?: (event: any, info: any) => void;
    layout?: boolean;
    layoutId?: string;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }
  
  export const motion: {
    div: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    span: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;
    button: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLButtonElement>>;
    img: React.ComponentType<MotionProps & React.HTMLAttributes<HTMLImageElement>>;
    [key: string]: React.ComponentType<MotionProps & any>;
  };
  
  export const AnimatePresence: React.ComponentType<{
    children?: React.ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
  }>;
}

declare module 'date-fns' {
  export function format(date: Date | number, format: string): string;
  export function parseISO(dateString: string): Date;
  export function isValid(date: Date): boolean;
  export function addDays(date: Date, amount: number): Date;
  export function subDays(date: Date, amount: number): Date;
  export function differenceInDays(dateLeft: Date, dateRight: Date): number;
  export function startOfDay(date: Date): Date;
  export function endOfDay(date: Date): Date;
  export function isSameDay(dateLeft: Date, dateRight: Date): boolean;
  export function isBefore(date: Date, dateToCompare: Date): boolean;
  export function isAfter(date: Date, dateToCompare: Date): boolean;
}

declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | ClassValue[] | { [key: string]: any };
  export default function clsx(...inputs: ClassValue[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...inputs: string[]): string;
}