using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using System.Security.Claims;
using System.Data.Entity.SqlServer.Utilities;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using System.Data.Entity.Validation;
using System.Diagnostics;
using Considerate.Hellolingo.DataAccess;

namespace Considerate.Hellolingo.AspNetIdentity
{
  public class ApplicationUserStore :
      IUserLoginStore<AspNetUser, string>,
      IUserClaimStore<AspNetUser, string>,
      IUserRoleStore<AspNetUser, string>,
      IUserPasswordStore<AspNetUser, string>,
      IUserSecurityStampStore<AspNetUser, string>,
      IQueryableUserStore<AspNetUser, string>,
      IUserEmailStore<AspNetUser, string>,
      IUserPhoneNumberStore<AspNetUser, string>,
      IUserTwoFactorStore<AspNetUser, string>,
      IUserLockoutStore<AspNetUser, string>
     
  {
    private readonly IDbSet<AspNetUserLogin> _logins;
    private readonly EntityStore<AspNetRole> _roleStore;
    private readonly IDbSet<AspNetUserClaim> _userClaims;
    //private readonly IDbSet<AspNetRole> _userRoles;
    private bool _disposed;
    private EntityStore<AspNetUser> _userStore;

    /// <summary>
    ///     Constructor which takes a db context and wires up the stores with default instances using the context
    /// </summary>
    /// <param name="context"></param>
    public ApplicationUserStore( HellolingoEntities context )
    {
      if( context == null )
      {
        throw new ArgumentNullException( "context" );
      }
      Context = context;
      AutoSaveChanges = true;
      _userStore = new EntityStore<AspNetUser>( context );
      _roleStore = new EntityStore<AspNetRole>( context );
      _logins = Context.Set<AspNetUserLogin>( );
      _userClaims = Context.Set<AspNetUserClaim>( );
      //_userRoles = Context.Set<AspNetRole>( );
    }

    /// <summary>
    ///     Context for the store
    /// </summary>
    public HellolingoEntities Context { get; private set; }

    /// <summary>
    ///     If true will call dispose on the DbContext during Dispose
    /// </summary>
    public bool DisposeContext { get; set; }

    /// <summary>
    ///     If true will call SaveChanges after Create/Update/Delete
    /// </summary>
    public bool AutoSaveChanges { get; set; }

    /// <summary>
    ///     Returns an IQueryable of users
    /// </summary>
    public IQueryable<AspNetUser> Users
    {
      get { return _userStore.EntitySet; }
    }

    /// <summary>
    ///     Return the claims for a user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual async Task<IList<Claim>> GetClaimsAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      await EnsureClaimsLoaded( user ).WithCurrentCulture( );
      return user.Claims.Select( c => new Claim( c.ClaimType, c.ClaimValue ) ).ToList( );
    }

    /// <summary>
    ///     Add a claim to a user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="claim"></param>
    /// <returns></returns>
    public virtual Task AddClaimAsync( AspNetUser user, Claim claim )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      if( claim == null )
      {
        throw new ArgumentNullException( "claim" );
      }
      _userClaims.Add( new AspNetUserClaim { UserId = user.Id, ClaimType = claim.Type, ClaimValue = claim.Value } );
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Remove a claim from a user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="claim"></param>
    /// <returns></returns>
    public virtual async Task RemoveClaimAsync( AspNetUser user, Claim claim )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      if( claim == null )
      {
        throw new ArgumentNullException( "claim" );
      }
      IEnumerable<AspNetUserClaim> claims;
      var claimValue = claim.Value;
      var claimType = claim.Type;
      if( AreClaimsLoaded( user ) )
      {
        claims = user.Claims.Where( uc => uc.ClaimValue == claimValue && uc.ClaimType == claimType ).ToList( );
      }
      else
      {
        var userId = user.Id;
        claims = await _userClaims.Where( uc => uc.ClaimValue == claimValue && uc.ClaimType == claimType && uc.UserId.Equals( userId ) ).ToListAsync( ).WithCurrentCulture( );
      }
      foreach( var c in claims )
      {
        _userClaims.Remove( c );
      }
    }

    /// <summary>
    ///     Returns whether the user email is confirmed
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<bool> GetEmailConfirmedAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.EmailConfirmed );
    }

    /// <summary>
    ///     Set IsConfirmed on the user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="confirmed"></param>
    /// <returns></returns>
    public virtual Task SetEmailConfirmedAsync( AspNetUser user, bool confirmed )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.EmailConfirmed = confirmed;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Set the user email
    /// </summary>
    /// <param name="user"></param>
    /// <param name="email"></param>
    /// <returns></returns>
    public virtual Task SetEmailAsync( AspNetUser user, string email )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.Email = email;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Get the user's email
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<string> GetEmailAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.Email );
    }

    /// <summary>
    ///     Find a user by email
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    public virtual Task<AspNetUser> FindByEmailAsync( string email )
    {
      ThrowIfDisposed( );
      return GetUserAggregateAsync( u => u.Email.ToUpper( ) == email.ToUpper( ) );
    }

    /// <summary>
    ///     Returns the DateTimeOffset that represents the end of a user's lockout, any time in the past should be considered
    ///     not locked out.
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<DateTimeOffset> GetLockoutEndDateAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return
          Task.FromResult( user.LockoutEndDateUtc.HasValue
              ? new DateTimeOffset( DateTime.SpecifyKind( user.LockoutEndDateUtc.Value, DateTimeKind.Utc ) )
              : new DateTimeOffset( ) );
    }

    /// <summary>
    ///     Locks a user out until the specified end date (set to a past date, to unlock a user)
    /// </summary>
    /// <param name="user"></param>
    /// <param name="lockoutEnd"></param>
    /// <returns></returns>
    public virtual Task SetLockoutEndDateAsync( AspNetUser user, DateTimeOffset lockoutEnd )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.LockoutEndDateUtc = lockoutEnd == DateTimeOffset.MinValue ? (DateTime?)null : lockoutEnd.UtcDateTime;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Used to record when an attempt to access the user has failed
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<int> IncrementAccessFailedCountAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.AccessFailedCount++;
      return Task.FromResult( user.AccessFailedCount );
    }

    /// <summary>
    ///     Used to reset the account access count, typically after the account is successfully accessed
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task ResetAccessFailedCountAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.AccessFailedCount = 0;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Returns the current number of failed access attempts.  This number usually will be reset whenever the password is
    ///     verified or the account is locked out.
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<int> GetAccessFailedCountAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.AccessFailedCount );
    }

    /// <summary>
    ///     Returns whether the user can be locked out.
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<bool> GetLockoutEnabledAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.LockoutEnabled );
    }

    /// <summary>
    ///     Sets whether the user can be locked out.
    /// </summary>
    /// <param name="user"></param>
    /// <param name="enabled"></param>
    /// <returns></returns>
    public virtual Task SetLockoutEnabledAsync( AspNetUser user, bool enabled )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.LockoutEnabled = enabled;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Find a user by id
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public virtual Task<AspNetUser> FindByIdAsync( string userId )
    {
      ThrowIfDisposed( );
      return GetUserAggregateAsync( u => u.Id.Equals( userId ) );
    }

    /// <summary>
    ///     Find a user by name
    /// </summary>
    /// <param name="userName"></param>
    /// <returns></returns>
    public virtual Task<AspNetUser> FindByNameAsync( string userName )
    {
      ThrowIfDisposed( );
      return GetUserAggregateAsync( u => u.UserName.ToUpper( ) == userName.ToUpper( ) );
    }

    /// <summary>
    ///     Insert an entity
    /// </summary>
    /// <param name="user"></param>
    public virtual async Task CreateAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.Id = Guid.NewGuid( ).ToString( );
      _userStore.Create( user );
      await SaveChanges( ).WithCurrentCulture( );
    }

    /// <summary>
    ///     Mark an entity for deletion
    /// </summary>
    /// <param name="user"></param>
    public virtual async Task DeleteAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      _userStore.Delete( user );
      await SaveChanges( ).WithCurrentCulture( );
    }

    /// <summary>
    ///     Update an entity
    /// </summary>
    /// <param name="user"></param>
    public virtual async Task UpdateAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      _userStore.Update( user );
      await SaveChanges( ).WithCurrentCulture( );
    }

    /// <summary>
    ///     Dispose the store
    /// </summary>
    public void Dispose( )
    {
      Dispose( true );
      GC.SuppressFinalize( this );
    }

    // IUserLogin implementation

    /// <summary>
    ///     Returns the user associated with this login
    /// </summary>
    /// <returns></returns>
    public virtual async Task<AspNetUser> FindAsync( UserLoginInfo login )
    {
      ThrowIfDisposed( );
      if( login == null )
      {
        throw new ArgumentNullException( "login" );
      }
      var provider = login.LoginProvider;
      var key = login.ProviderKey;
      var userLogin =
                await _logins.FirstOrDefaultAsync(l => l.LoginProvider == provider && l.ProviderKey == key).WithCurrentCulture();
      if( userLogin != null )
      {
        var userId = userLogin.UserId;
        return await GetUserAggregateAsync( u => u.Id.Equals( userId ) ).WithCurrentCulture( );
      }
      return null;
    }

    /// <summary>
    ///     Add a login to the user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="login"></param>
    /// <returns></returns>
    public virtual Task AddLoginAsync( AspNetUser user, UserLoginInfo login )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      if( login == null )
      {
        throw new ArgumentNullException( "login" );
      }
      _logins.Add( new AspNetUserLogin
      {
        UserId = user.Id,
        ProviderKey = login.ProviderKey,
        LoginProvider = login.LoginProvider
      } );
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Remove a login from a user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="login"></param>
    /// <returns></returns>
    public virtual async Task RemoveLoginAsync( AspNetUser user, UserLoginInfo login )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      if( login == null )
      {
        throw new ArgumentNullException( "login" );
      }
      AspNetUserLogin entry;
      var provider = login.LoginProvider;
      var key = login.ProviderKey;
      if( AreLoginsLoaded( user ) )
      {
        entry = user.Logins.SingleOrDefault( ul => ul.LoginProvider == provider && ul.ProviderKey == key );
      }
      else
      {
        var userId = user.Id;
        entry = await _logins.SingleOrDefaultAsync( ul => ul.LoginProvider == provider && ul.ProviderKey == key && ul.UserId.Equals( userId ) ).WithCurrentCulture( );
      }
      if( entry != null )
      {
        _logins.Remove( entry );
      }
    }

    /// <summary>
    ///     Get the logins for a user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual async Task<IList<UserLoginInfo>> GetLoginsAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      await EnsureLoginsLoaded( user ).WithCurrentCulture( );
      return user.Logins.Select( l => new UserLoginInfo( l.LoginProvider, l.ProviderKey ) ).ToList( );
    }

    /// <summary>
    ///     Set the password hash for a user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="passwordHash"></param>
    /// <returns></returns>
    public virtual Task SetPasswordHashAsync( AspNetUser user, string passwordHash )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.PasswordHash = passwordHash;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Get the password hash for a user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<string> GetPasswordHashAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.PasswordHash );
    }

    /// <summary>
    ///     Returns true if the user has a password set
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<bool> HasPasswordAsync( AspNetUser user )
    {
      return Task.FromResult( user.PasswordHash != null );
    }

    /// <summary>
    ///     Set the user's phone number
    /// </summary>
    /// <param name="user"></param>
    /// <param name="phoneNumber"></param>
    /// <returns></returns>
    public virtual Task SetPhoneNumberAsync( AspNetUser user, string phoneNumber )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.PhoneNumber = phoneNumber;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Get a user's phone number
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<string> GetPhoneNumberAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.PhoneNumber );
    }

    /// <summary>
    ///     Returns whether the user phoneNumber is confirmed
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<bool> GetPhoneNumberConfirmedAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.PhoneNumberConfirmed );
    }

    /// <summary>
    ///     Set PhoneNumberConfirmed on the user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="confirmed"></param>
    /// <returns></returns>
    public virtual Task SetPhoneNumberConfirmedAsync( AspNetUser user, bool confirmed )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.PhoneNumberConfirmed = confirmed;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Add a user to a role
    /// </summary>
    /// <param name="user"></param>
    /// <param name="roleName"></param>
    /// <returns></returns>
    public virtual async Task AddToRoleAsync( AspNetUser user, string roleName )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      if( String.IsNullOrWhiteSpace( roleName ) )
      {
        throw new ArgumentException( "Value Cannot Be Null Or Empty", "roleName" );
      }
      var roleEntity = await _roleStore.DbEntitySet.SingleOrDefaultAsync(r => r.Name.ToUpper() == roleName.ToUpper()).WithCurrentCulture();
      if( roleEntity == null )
      {
        throw new InvalidOperationException( String.Format( CultureInfo.CurrentCulture,
            "Role Not Found", roleName ) );
      }

     // var ur = new TUserRole { UserId = user.Id, RoleId = roleEntity.Id };
      user.Roles.Add( roleEntity );
    }

    /// <summary>
    ///     Remove a user from a role
    /// </summary>
    /// <param name="user"></param>
    /// <param name="roleName"></param>
    /// <returns></returns>
    public virtual async Task RemoveFromRoleAsync( AspNetUser user, string roleName )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      if( String.IsNullOrWhiteSpace( roleName ) )
      {
        throw new ArgumentException( "Value Cannot Be Null Or Empty", "roleName" );
      }
      var roleEntity = await _roleStore.DbEntitySet.SingleOrDefaultAsync(r => r.Name.ToUpper() == roleName.ToUpper()).WithCurrentCulture();
      if( roleEntity != null )
      {
        var roleId = roleEntity.Id;
        var userId = user.Id;
        var userRole = user.Roles.SingleOrDefault(r =>r.Id ==roleId);
        if( userRole != null )
        {
          user.Roles.Remove(userRole);
        }
      }
    }

    /// <summary>
    ///     Get the names of the roles a user is a member of
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual async Task<IList<string>> GetRolesAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      var userId = user.Id;
      return await Task.FromResult<IList<string>>(user.Roles.Join(this.Context.AspNetRoles, ur => ur.Id, r => r.Id, (ur, r) => r.Name).ToList());
    }

    /// <summary>
    ///     Returns true if the user is in the named role
    /// </summary>
    /// <param name="user"></param>
    /// <param name="roleName"></param>
    /// <returns></returns>
    public virtual async Task<bool> IsInRoleAsync( AspNetUser user, string roleName )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      if( String.IsNullOrWhiteSpace( roleName ) )
      {
        throw new ArgumentException( "Value Cannot Be Null Or Empty", "roleName" );
      }
      var role = await _roleStore.DbEntitySet.SingleOrDefaultAsync(r => r.Name.ToUpper() == roleName.ToUpper()).WithCurrentCulture();
      if( role != null )
      {
        var userId = user.Id;
        var roleId = role.Id;
        return await Task.FromResult<bool>(
                    this.Context.AspNetRoles.Any(r => r.Name == roleName && r.Users.Any(u => u.Id.Equals(user.Id))));
      }
      return false;
    }

    /// <summary>
    ///     Set the security stamp for the user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="stamp"></param>
    /// <returns></returns>
    public virtual Task SetSecurityStampAsync( AspNetUser user, string stamp )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.SecurityStamp = stamp;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Get the security stamp for a user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<string> GetSecurityStampAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.SecurityStamp );
    }

    /// <summary>
    ///     Set whether two factor authentication is enabled for the user
    /// </summary>
    /// <param name="user"></param>
    /// <param name="enabled"></param>
    /// <returns></returns>
    public virtual Task SetTwoFactorEnabledAsync( AspNetUser user, bool enabled )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      user.TwoFactorEnabled = enabled;
      return Task.FromResult( 0 );
    }

    /// <summary>
    ///     Gets whether two factor authentication is enabled for the user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public virtual Task<bool> GetTwoFactorEnabledAsync( AspNetUser user )
    {
      ThrowIfDisposed( );
      if( user == null )
      {
        throw new ArgumentNullException( "user" );
      }
      return Task.FromResult( user.TwoFactorEnabled );
    }

    // Only call save changes if AutoSaveChanges is true
    private async Task SaveChanges( )
    {
      if( AutoSaveChanges )
      {
        await Context.SaveChangesAsync( ).WithCurrentCulture( );
      }
    }

    private bool AreClaimsLoaded( AspNetUser user )
    {
      return Context.Entry( user ).Collection( u => u.Claims ).IsLoaded;
    }

    private async Task EnsureClaimsLoaded( AspNetUser user )
    {
      if( !AreClaimsLoaded( user ) )
      {
        var userId = user.Id;
        await _userClaims.Where( uc => uc.UserId.Equals( userId ) ).LoadAsync( ).WithCurrentCulture( );
        Context.Entry( user ).Collection( u => u.Claims ).IsLoaded = true;
      }
    }

    private async Task EnsureRolesLoaded( AspNetUser user )
    {
      if( !Context.Entry( user ).Collection( u => u.Roles ).IsLoaded )
      {
        var userId = user.Id;
        await Context.Entry( user ).Collection( u => u.Roles ).LoadAsync().WithCurrentCulture( );
        Context.Entry( user ).Collection( u => u.Roles ).IsLoaded = true;
      }
    }

    private bool AreLoginsLoaded( AspNetUser user )
    {
      return Context.Entry( user ).Collection( u => u.Logins ).IsLoaded;
    }

    private async Task EnsureLoginsLoaded( AspNetUser user )
    {
      if( !AreLoginsLoaded( user ) )
      {
        var userId = user.Id;
        await _logins.Where( uc => uc.UserId.Equals( userId ) ).LoadAsync( ).WithCurrentCulture( );
        Context.Entry( user ).Collection( u => u.Logins ).IsLoaded = true;
      }
    }

    /// <summary>
    /// Used to attach child entities to the User aggregate, i.e. Roles, Logins, and Claims
    /// </summary>
    /// <param name="filter"></param>
    /// <returns></returns>
    protected virtual async Task<AspNetUser> GetUserAggregateAsync( Expression<Func<AspNetUser, bool>> filter )
    {
      string id;
      AspNetUser user;
      if( FindByIdFilterParser.TryMatchAndGetId( filter, out id ) )
      {
        user = await _userStore.GetByIdAsync( id ).WithCurrentCulture( );
      }
      else
      {
        user = await Users.FirstOrDefaultAsync( filter ).WithCurrentCulture( );
      }
      if( user != null )
      {
        await EnsureClaimsLoaded( user ).WithCurrentCulture( );
        await EnsureLoginsLoaded( user ).WithCurrentCulture( );
        await EnsureRolesLoaded( user ).WithCurrentCulture( );
      }
      return user;
    }

    private void ThrowIfDisposed( )
    {
      if( _disposed )
      {
        throw new ObjectDisposedException( GetType( ).Name );
      }
    }

    /// <summary>
    ///     If disposing, calls dispose on the Context.  Always nulls out the Context
    /// </summary>
    /// <param name="disposing"></param>
    protected virtual void Dispose( bool disposing )
    {
      if( DisposeContext && disposing && Context != null )
      {
        Context.Dispose( );
      }
      _disposed = true;
      Context = null;
      _userStore = null;
    }

    // We want to use FindAsync() when looking for an User.Id instead of LINQ to avoid extra 
    // database roundtrips. This class cracks open the filter expression passed by 
    // UserStore.FindByIdAsync() to obtain the value of the id we are looking for 
    private static class FindByIdFilterParser
    {
      // expression pattern we need to match
      private static readonly Expression<Func<AspNetUser, bool>> Predicate = u => u.Id.Equals(default(string));
      // method we need to match: Object.Equals() 
      private static readonly MethodInfo EqualsMethodInfo = ((MethodCallExpression)Predicate.Body).Method;
      // property access we need to match: User.Id 
      private static readonly MemberInfo UserIdMemberInfo = ((MemberExpression)((MethodCallExpression)Predicate.Body).Object).Member;

      internal static bool TryMatchAndGetId( Expression<Func<AspNetUser, bool>> filter, out string id )
      {
        // default value in case we can’t obtain it 
        id = default( string );

        // lambda body should be a call 
        if( filter.Body.NodeType != ExpressionType.Call )
        {
          return false;
        }

        // actually a call to object.Equals(object)
        var callExpression = (MethodCallExpression)filter.Body;
        if( callExpression.Method != EqualsMethodInfo )
        {
          return false;
        }
        // left side of Equals() should be an access to User.Id
        if( callExpression.Object == null
            || callExpression.Object.NodeType != ExpressionType.MemberAccess
            || ( (MemberExpression)callExpression.Object ).Member != UserIdMemberInfo )
        {
          return false;
        }

        // There should be only one argument for Equals()
        if( callExpression.Arguments.Count != 1 )
        {
          return false;
        }

        MemberExpression fieldAccess;
        if( callExpression.Arguments[ 0 ].NodeType == ExpressionType.Convert )
        {
          // convert node should have an member access access node
          // This is for cases when primary key is a value type
          var convert = (UnaryExpression)callExpression.Arguments[0];
          if( convert.Operand.NodeType != ExpressionType.MemberAccess )
          {
            return false;
          }
          fieldAccess = (MemberExpression)convert.Operand;
        }
        else if( callExpression.Arguments[ 0 ].NodeType == ExpressionType.MemberAccess )
        {
          // Get field member for when key is reference type
          fieldAccess = (MemberExpression)callExpression.Arguments[ 0 ];
        }
        else
        {
          return false;
        }

        // and member access should be a field access to a variable captured in a closure
        if( fieldAccess.Member.MemberType != MemberTypes.Field
            || fieldAccess.Expression.NodeType != ExpressionType.Constant )
        {
          return false;
        }

        // expression tree matched so we can now just get the value of the id 
        var fieldInfo = (FieldInfo)fieldAccess.Member;
        var closure = ((ConstantExpression)fieldAccess.Expression).Value;

        id = (string)fieldInfo.GetValue( closure );
        return true;
      }
    }
  }
}
