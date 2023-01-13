import { SubMenu } from './submenu';

export interface UserMainMenuDto {
  pageId :number;
  pageName: string;
  uiComponent :string;
  routerLink :string;
  icon :string;
  subMenus: any;
}
