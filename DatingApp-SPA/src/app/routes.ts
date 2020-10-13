import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    // we can use canActivate for different paths and there is no issue in that
    // but we have used the below method to see the different options how can use AuthGuard
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent },
            { path: 'lists', component: ListsComponent },
            { path: 'messages', component: MessagesComponent }
        ]
    },
    // { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
    // { path: 'lists', component: ListsComponent },
    // { path: 'messages', component: MessagesComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];