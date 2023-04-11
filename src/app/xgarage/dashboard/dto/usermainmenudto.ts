import { UserSubMenuDto } from './usersubmenudto';

export interface UserMainMenuDto {
  id?: number;
  pageId?: number;
  pageName?: string;
  uiComponent?: string;
  routerLink?: string;
  icon?: string;
  subMenus?: UserSubMenuDto[];
}
